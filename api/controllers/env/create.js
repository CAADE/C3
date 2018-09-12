
module.exports = {

  friendlyName: 'env create',

  description: 'Add description',

  inputs: {
    name: {
      description: 'Description of Attribute',
      type: 'string',
      required: true
},

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
      let environment = await Environment.findOrCreate({name: inputs.name}, {name:inputs.name});

      // broadcast change
      sails.sockets.broadcast('c3', 'environment', environment);

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(environment);
      }
      else {
        // Display the welcome view.
        return exits.success(environment);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

