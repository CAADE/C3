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


  exits: {},


  fn: async function (inputs, exits) {

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
        console.error('Application Stacklet not found:');
        return exits.notFound('Application Stacklet not found');
      }
      // Create the ApplicationInstance from the appStacklet
      let appInstance = await ApplicationInstance.create({
        name: app.name + '-' + environ.name,
        stacklet: appStacklet.id,
        state: 'Initializing',
        app: app.id,
        env: environ.id
      }).fetch();

      // Recursively build the services from the servicelets.
      if (appStacklet.image) {
        let service = await Service.create({
          name: appInstance.name,
          config: inputs.config,
          replicas: appStacklet.replicas
        }).fetch();
        await Service.addToCollection(service.id, 'apps', appInstance.id);
        await ApplicationInstance.addToCollection(appInstance.id, 'services', service.id);
        // await sails.helpers.service.set.with({service:service,replicas:appStacklet.replicas});
      }
      for (let i in appStacklet.servicelets) {
        // Create a service for each servicelet and attach it to the applicationInstance.
        let servicelet = appStacklet.servicelets[i];
        let service = await Service.create({
          name: appInstance.name + '-' + servicelet.name,
          config: inputs.config,
          servicelet: servicelet.id,
          replicas: servicelet.replicas
        }).fetch();
        await Service.addToCollection(service.id, 'apps', appInstance.id);
        await ApplicationInstance.addToCollection(appInstance.id, 'services', service.id);
        await sails.helpers.service.set.with({service:service,replicas:servicelet.replicas});
      }
      return exits.success(appInstance);
    }
    catch (e) {
      console.error(e);
      console.error(e);
      return exits.notFound(e);
    }
  }
};
