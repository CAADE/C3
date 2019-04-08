
module.exports = {

  friendlyName: 'App Create',

  description: 'Create Application',

  inputs: {
    /* <parameter name>: {
      description: 'The ID of the user to look up.',
      type: '<parameter type>',
      required: true
    },
    */
    name: {
      description: 'Name of the new application',
      type: 'string',
      required: true
    },
    stack: {
      description: 'Name of the stack to use for the application',
      type: 'string',
      required: true
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
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let stack = await ServiceStack.findOne({name: inputs.stack});
      if (!stack) {
        console.error('Stack not found!:', inputs);
        return exits.notFound('/signup');
      }
      let app = await Application.create({name: inputs.name, stack: stack.id}).fetch();
      // Display the results
      if(inputs.mode === 'json') {
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

