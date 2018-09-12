
module.exports = {

  friendlyName: 'env list',

  description: 'Add description',

  inputs: {
    /* <parameter name>: {
      description: 'The ID of the user to look up.',
      type: '<parameter type>',
      required: true
    },
    */

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
      let item = await Environment.find();

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(item);
      }
      else {
        // Display the welcome view.
        return exits.success(item);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

