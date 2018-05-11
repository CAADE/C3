
module.exports = {

  friendlyName: 'dev up',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'The name of the application to start',
      type: 'string',
      required: true
    },
    environments: {
      description: 'The environments to launch the application',
      type: 'string',
      required: true
    },
    services: {
      description: 'The services from the application to launch',
      type: 'string',
      required: true
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
      viewTemplatePath: 'dev/show'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let user = await User.findOne(inputs.userId);
      if (!user) {return exits.notFound('/signup');}

      // Display the results
      if(inputs.mode === "json") {
        // Return json
        return exits.json({name: user.name});
      }
      else {
        // Display the welcome view.
        return exits.success({name: user.name});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

