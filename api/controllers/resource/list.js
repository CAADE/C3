
module.exports = {

  friendlyName: 'resource list',

  description: 'Add description',

  inputs: {
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

    try {
      let resources = await Resource.find().populateAll();

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(resources);
      }
      else {
        // Display the welcome view.
        return exits.success(resources);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

