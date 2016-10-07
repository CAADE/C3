var Promise = require('bluebird');

module.exports = {
  /**
   * launch
   * @param app
   * @param env
   * Launch the application in the specifed Environment.
   */
  up: function (app, env) {
    Application.findOne(app.id).populateAll()
      .then(function (app) {
        var running = _.find(app.instances, function (instance) {
            return (instance.state == "Running" || instance.state == "Initializing") && instance.env == env.id;
          })
          if (running) {
            return [app, running];
          }
          else {
            return [app, ApplicationInstance.create({app: app, env: env, state: "Initializing"})]
          }
      })
      .spread(function (app, appInstance) {
        // Get all of the services from the app.stack
        app.instances.add(appInstance.id);
        return app.save().then(function () {
          // Traverse the stack and get the stacklet and its servicelets.
          return [appInstance, ApplicationStacklet.find({stack: app.stack, env: env.id}).populateAll()];
        })
      })
      .spread(function (appInstance, stacklets) {
        // ServiceInstance is created and attached to the ApplicationInstance.
        return [appInstance, Promise.map(stacklets[0].servicelets, function (servicelet) {
          return ServiceInstance.create({servicelet: servicelet, application: appInstance, state: "Initializing"})
            .then(function(instance) { return instance; });
        })];
      })
      .spread(function (appInstance, serviceInstances) {
        _.each(serviceInstances, function (serviceInstance) {
          appInstance.services.add(serviceInstance.id);
        });
        return appInstance.save().then(function () {
          return ApplicationInstance.findOne(appInstance.id).populateAll();
        });
      })
      .then(function (appInstance) {
        return [appInstance, CloudBrokerService.getResources(appInstance)];
      })
      .spread(function (appInstance, resources) {
        return [appInstance, ProvisionEngineService.provisionApplication(resources, appInstance)];
      })
      .spread(function (appInstance, services) {
        appInstance.state = "Running";
        return appInstance.save().then(function () {
          return appInstance;
        });
      });
  },
  kill: function (app, instance, services, signal) {
    return ApplicationInstance.findOne(instance.id).populateAll()
      .then(function (appInstance) {
        return Promise.each(appInstance.services, function (service) {
          return ServiceInstance.findOne(service.id).populateAll()
            .then(function (sInstance) {
              var serviceName = app.name + "-" + sInstance.servicelet.name;
              if (services.length == 0) {
                service.state = "Exit " + signal;
                return service.save().then(function () {
                  return service
                });
              }
              else if (_.find(services, function (mservice) {
                    return mservice == serviceName;
                  }
                )) {
                service.state = "Exit " + signal;
                return service.save().then(function () {
                  return service
                });
              }
            })
        })
      })
  }
}
