module.exports = {

  friendlyName: 'events create',

  description: 'Create Events',

  inputs: {
    name: {
      description: 'name of the events',
      type: 'string',
      required: true
    },
    amount: {
      description: 'amount of the events',
      type: 'number',
      required: false
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
      if (!inputs.amount) {
        inputs.amount = 0;
      }

      let item = await Events.findOrCreate({name: inputs.name}, {name: inputs.name, value: inputs.amount});

      // Display the results
      if (inputs.mode === 'json') {
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

