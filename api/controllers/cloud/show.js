module.exports = {

  friendlyName: 'cloud show',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'The name of the cloud to show',
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
      viewTemplatePath: 'cloud/show'
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
      let cloud = await User.findOne({name:inputs.name});
      if (!cloud) {
        return exits.notFound('/signup');
      }

      // Display the results
      if (inputs.mode === "json") {
        // Return json
        return exits.json({cloud: cloud});
      }
      else {
        // Display the welcome view.
        return exits.success({cloud: cloud});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

