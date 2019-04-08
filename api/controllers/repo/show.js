module.exports = {

  friendlyName: 'repo show',

  description: 'Show Repository',

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
      viewTemplatePath: 'repo/show'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No item with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {

    try {
      if (inputs.mode === 'json') {
        let images = await Image.find().populateAll();
        let stacks = await ServiceStack.find().populateAll();
        // Return json
        return exits.json({images:images, services:stacks});
      }
      else {
        // Display the welcome view.
        let images = await Image.find().populateAll();
        let stacks = await ServiceStack.find().populateAll();
        return exits.success({images: images, services:stacks});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

