module.exports = {
  friendlyName: 'cloud create',
  description: 'Add a cloud to the C3 instance with <name> and <type>',

  inputs: {
    type: {
      description: 'The type of cloud to create',
      type: 'string',
      required: true
    },
    name: {
      description: 'The name of cloud to create',
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
      viewTemplatePath: 'welcome'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'That type of cloud is not supported',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let user = await;
      Cloud.findOne(inputs.user);
      if (!user) {
        return exits.notFound('/signup');
      }

      // Display the results
      if (inputs.mode === "json") {
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

