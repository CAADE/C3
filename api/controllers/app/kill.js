module.exports = {

  friendlyName: 'app kill',

  description: 'Add description',

  inputs: {
    name: {
      description: 'Name of the Application',
      type: 'string',
      required: false
    },
    id: {
      description: 'Name of the Application',
      type: 'string',
      required: false
    },
    signal: {
      description: 'Kill signal',
      type: 'number',
      required: false
    },
    message: {
      description: 'Kill Message',
      type: 'string',
      required: false
    },
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'welcome'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No item with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'c3');
    }
    try {
      let app;
      if (inputs.name) {
        app = await Application.findOne({name: inputs.name});
      }
      else if (inputs.id) {
        app = await Application.findOne({id: inputs.id});
      }
      if (!app) {
        return exits.notFound('/notFound');
      }
      if (!inputs.signal) {
        inputs.signal = 15;
      }
      if (!inputs.message) {
        inputs.message = 'Application Killed';
      }
      await sails.helpers.app.kill.with({app: app, signal: inputs.signal, reason: inputs.message});

      app = await Application.findOne({id: app.id});

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(app);
      }
      else {
        // Display the welcome view.
        return exits.success(app);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

