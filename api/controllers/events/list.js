module.exports = {

  friendlyName: 'events list',

  description: 'List Events',

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
      let events = await Events.find();

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(events);
      }
      else {
        // Display the welcome view.
        return exits.success(events);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

