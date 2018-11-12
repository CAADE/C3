module.exports = {
  friendlyName: 'Kill',
  description: 'Kill app.',
  inputs: {
    app: {
      description: 'Name or ref of the Application',
      type: 'ref',
      required: false
    },
    instance: {
      description: 'Application Instance',
      type: 'ref',
      required: false
    },
    env: {
      description: 'name or ref of the environment',
      type: 'ref',
      required: false
    },
    signal: {
      description: 'signal for the kill',
      type: 'number',
      required: false
    },
    reason: {
      description: 'Reason to kill the application',
      type: 'string',
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
    try {
      let signal = inputs.signal;
      if (!signal) {
        signal = 15;
      }

      let message = inputs.reason;
      if (!message) {
        message = 'Killed with signal:' + signal;
      }

      let instances = [];
      let app;
      if (inputs.app) {
        app = inputs.app;
        if (typeof app === 'string') {
          app = await Application.findOne({name: app}).populateAll();
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
          instances = await ApplicationInstance.find({app: app.id, env: environ.id}).populateAll();
        }
        else {
          instances = await ApplicationInstance.find({app: app.id}).populateAll();
        }
      }
      else {
        if (typeof inputs.instance === 'string') {
          instances = await ApplicationInstance.find({id: inputs.instance}).populateAll();
        }
        else {
          instances = await ApplicationInstance.find({id: inputs.instance.id}).populateAll();
        }
      }
      for (let i in instances) {
        let instance = instances[i];
        let rinstances = await ApplicationInstance.update({id: instance.id}, {state: 'Stopping', message: message}).fetch();
        sails.sockets.broadcast('c3', 'instance',rinstances);
        for (let j in instance.services) {
          let service = instance.services[j];
          await sails.helpers.service.kill.with({service: service, signal: signal, reason: message});
        }
        rinstances = await ApplicationInstance.update({id: instance.id}, {state: 'Stopped', message: message}).fetch();
        sails.sockets.broadcast('c3', 'instance', rinstances);
      }

      sails.sockets.broadcast('c3', 'app',[app]);
      return exits.success(instances);
    }
    catch (e) {
      console.error('Error in Kill App:', e);
      return exits.success();
    }
  }
};
