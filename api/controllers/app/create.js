module.exports = {

  friendlyName: 'app create',

  description: 'Create Application with stack and name',

  inputs: {
    name: {
      description: 'Name of the application',
      type: 'string',
      required: true
    },
    stack: {
      description: 'Name of the stack to use for the application',
      type: 'string',
      required: true
    },
    config: {
      description: 'Configuration files',
      type: 'json',
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
      responseType: '',
      statusCode: 404
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let stack = await ServiceStack.findOne({name: inputs.stack});
      if (!stack) {
        return exits.notFound(inputs.stack + " Not Found");
      }
      if (!inputs.hasOwnProperty('config')) {
        inputs.config = {};
      }
      let app = await Application.findOrCreate({name: inputs.name}, {
        name: inputs.name,
        stack: stack.id,
        config: inputs.config
      });
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

