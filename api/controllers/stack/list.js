
module.exports = {

  friendlyName: 'stack list',
  description: 'List Stacks',
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
      let stacks = await ServiceStack.find().populateAll();
      console.log(stacks);
      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(stacks);
      }
      else {
        // Display the welcome view.
        return exits.success(stacks);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

