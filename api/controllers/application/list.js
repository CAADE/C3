
module.exports = {

  friendlyName: 'application list',

  description: ' Add description ',

  inputs: {
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
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let apps = await Application.find();
      // Display the results
      if(inputs.mode === "json") {
        // Return json
        return exits.json({applications:app});
      }
      else {
        // Display the welcome view.
        return exits.success({applications: apps.name});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

