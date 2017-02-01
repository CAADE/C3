var Promise = require('bluebird');

module.exports = {
  /**
   * launch
   * @param app
   * @param env
   * Launch the application in the specifed Environment.
   */
  _upNewInstance: function (app, appInstance, env) {
    return ApplicationStacklet.find({stack: app.stack, env: env.id}).populateAll()
      .then(function (stacklets) {
        // ServiceInstance is created and attached to the ApplicationInstance.
        if(stacklets.length > 0) {
          return Promise.map(stacklets[0].servicelets, function (servicelet) {
            return ServiceInstance.create({servicelet: servicelet, application: appInstance, state: "Initializing"})
              .then(function (instance) {
                return instance;
              });
          });
        }
        else {
          return null;
        }
      })
      .then(function (serviceInstances) {
        _.each(serviceInstances, function (serviceInstance) {
          appInstance.services.add(serviceInstance.id);
        });
        return appInstance.save().then(function () {
          return ApplicationInstance.findOne(appInstance.id).populateAll();
        });
      })
  },
  _upExistingInstance: function (app, appInstance) {
    return ApplicationInstance.findOne(appInstance.id).populateAll();
  },
  up: function (app, env) {
    Application.findOne(app.id).populateAll()
      .then(function (app) {

        // Find an app.instance that is running.
        var running = _.find(app.instances, function (instance) {
          return (instance.state == "Running" || instance.state == "Initializing") && instance.env == env.id;
        })

        if (running) {
          // If it is running then check its services.
          // Make sure all of its services are are up and running.
          //If it is in the Initializing phase then make sure its
          // Services are up and running.
          return ApplicationOrchestratorService._upExistingInstance(app, running);
        }
        else {
          // If you cannot find either then create a new instance and
          // add it to the application.
          return ApplicationInstance.create({app: app, env: env, state: "Initializing"})
            .then(function (appInstance) {
              app.instances.add(appInstance.id);
              return app.save().then(function () {
                return ApplicationOrchestratorService._upNewInstance(app, appInstance,env);
              })
            });
        }
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
