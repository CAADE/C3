
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

  fn: async function (inputs, exits, env) {

    try {
      if(inputs.mode === 'json') {
        // Return json
        return exits.json();
      }
      else {
        // Display the welcome view.
        return exits.success();
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

