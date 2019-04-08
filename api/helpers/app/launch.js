module.exports = {
  friendlyName: 'Launch',
  description: 'Launch app.',
  inputs: {
    app: {
      description: 'Name or ref of the Application',
      type: 'ref',
      required: true
    },
    env: {
      description: 'Name or ref of the Environment',
      type: 'ref',
      required: true
    },
    config: {
      description: 'Config of the Application',
      type: 'json',
      required: false
    },
  },


  exits: {
    notFound: {
      description: 'The Item could not be found',
      responseType: 'redirect'
    }
  },


  fn: async function (inputs, exits) {
    let appInstance;

    try {
      let app = inputs.app;
      if (typeof app === 'string') {
        app = await application.findOne({name: app}).populateAll();
        if (!app) {
          console.error('Application not found:');
          return exits.notFound(app);
        }
      }
      let environ = inputs.env;
      if (typeof environ === 'string') {
        environ = await Environment.findOne({name: environ}).populateAll();
        if (!environ) {
          console.error('Environment not found:');
          return exits.notFound(environ);
        }
      }
      let appStacklet = await Stacklet.findOne({stack: app.stack.id, env: environ.id}).populateAll();
      if (!appStacklet) {
        console.error('Application Stacklet not found:', environ.name, '>>', environ.id, '>>', app.stack);
        let stacklets = await Stacklet.find({stack: app.stack.id});
        console.error('Stacklets:', stacklets);
        return exits.notFound('Application Stacklet not found:', app.stack.name);
      }
      // Create the ApplicationInstance from the appStacklet
      appInstance = await ApplicationInstance.create({
        name: app.name + '-' + environ.name,
        stacklet: appStacklet.id,
        state: 'Initializing',
        app: app.id,
        env: environ.id
      }).fetch();
      sails.sockets.broadcast('c3', 'instance', [appInstance]);
      await sails.helpers.events.inc.with({events: 'ApplicationInstance', value: 1});

      // Recursively build the services from the servicelets.
      if (appStacklet.image) {
        let service = await Service.create({
          name: appInstance.name,
          config: inputs.config,
          state: 'Initializing',
          replicas: appStacklet.replicas,
          env: environ.id
        }).fetch();
        await Service.addToCollection(service.id, 'apps', appInstance.id);
        await ApplicationInstance.addToCollection(appInstance.id, 'services', service.id);
        // await sails.helpers.service.set.with({service:service,replicas:appStacklet.replicas});
        sails.sockets.broadcast('c3', 'service', [service]);
      }
      for (let i in appStacklet.servicelets) {
        // Create a service for each servicelet and attach it to the applicationInstance.
        let servicelet = appStacklet.servicelets[i];
        let service = await Service.create({
          name: appInstance.name + '-' + servicelet.name,
          config: inputs.config,
          state: 'Initializing',
          servicelet: servicelet.id,
          replicas: servicelet.replicas,
          env: environ.id
        }).fetch();
        await Service.addToCollection(service.id, 'apps', appInstance.id);
        await ApplicationInstance.addToCollection(appInstance.id, 'services', service.id);

        await sails.helpers.service.set.with({service: service, replicas: servicelet.replicas})
          .intercept('stackletNotFound', () => {
            console.error('Inside StackletNotFound!');
            return new Error('Stacklet Not Found');
          });
      }
      let appInstances = await ApplicationInstance.update({id: appInstance.id}, {state: 'Running'}).fetch();
      appInstance =appInstances[0];
      sails.sockets.broadcast('c3', 'instance',appInstances);
      return exits.success(appInstances);
    }
    catch (e) {
      console.error('Error for Launch:', e);
      await sails.helpers.app.kill.with({instance: appInstance, signal: 9, reason: 'Error during launch'});
      let appInstances = await ApplicationInstance.update({id: appInstance.id}, {
        state: 'Error',
        message: 'Stacklet not Found' + e
      }).fetch();
      sails.sockets.broadcast('c3', 'instance',appInstances);

      return exits.success(appInstance);
    }
  }
};
