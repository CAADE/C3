module.exports = {

  friendlyName: 'application delete',

  description: 'Remove the application from the system',

  inputs: {
    /* <parameter name>: {
      description: 'The ID of the user to look up.',
      type: '<parameter type>',
      required: true
    },
    */
    name: {
      description: 'Description of Attribute',
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
      viewTemplatePath: 'list'
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

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let user = await Application.findOne({name:inputs.name});
      if (!user) {
        return exits.notFound('list');
      }
      await Application.destroy({name:inputs.name});
      // Display the results
      if (inputs.mode === "json") {
        // Return json
        return exits.json({name: inputs.name});
      }
      else {
        // Display the welcome view.
        return exits.success({name: inputs.name});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

