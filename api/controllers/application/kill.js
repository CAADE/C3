module.exports = {

  friendlyName: 'application kill',

  description: 'Kill services of an application in an environment',

  inputs: {
    /* <parameter name>: {
      description: 'The ID of the user to look up.',
      type: '<parameter type>',
      required: true
    },
    */
    name: {
      description: 'Name of the application',
      type: 'string',
      required: true
    },
    env: {
      description: 'Name of the environment',
      type: 'string',
      required: true
    },
    services: {
      description: 'List of Services to kill',
      type: 'string',
      required: false
    },
    signal: {
      description: 'Kill signal to send to services',
      type: 'number',
      required: false
    },

    mode: {
      description: "results format: json or html",
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
      description: 'No application with the specified name was found.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    try {
      let envs = [];
      let services = [];
      let signal = 9;
      if(inputs.env) {
        envs = inputs.env.split(/,/);
      }
      let app = await Application.findOne({name:inputs.name});
      if (!app) {
        return exits.notFound('list');
      }
      // Don't wait for the results.
      // Async call.
      app.kill(envs, services, signal);
      if (inputs.mode === "json") {
        // Return json
        return exits.json({name: app.name});
      }
      else {
        // Display the welcome view.
        return exits.success({name: app.name});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

