
module.exports = {

  friendlyName: 'stacklet list',

  description: 'List the stacklets',

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
      let stacklets = await Stacklet.find().populateAll();
      for(let i in stacklets) {
        console.log("STACKLETS:", stacklets[i].servicelets);
      }

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(stacklets);
      }
      else {
        // Display the welcome view.
        return exits.success(stacklets);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

