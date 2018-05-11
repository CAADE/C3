module.exports = {

  friendlyName: 'cloud remove',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'Name of the cloud to remove',
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
      viewTemplatePath: 'cloud/list'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No cloud with the specified name was found',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let cloud = await Cloud.findOne({name:inputs.name});
      if (!cloud) {
        return exits.notFound('/signup');
      }
      await Cloud.destroy({name:inputs.name});
      // Display the results
      if (inputs.mode === "json") {
        // Return json
        return exits.json({message: inputs.name + ' cloud removed'});
      }
      else {
        // Display the welcome view.
        let clouds = Cloud.find();
        return exits.success({clouds: clouds});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

