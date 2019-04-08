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
      viewTemplatePath: 'events/list'
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
      let events = await Events.find().populateAll();
      for(let i in events) {
        let event = events[i];
        for(let j in event.triggers) {
          let trigger = event.triggers[j];
          trigger = await Trigger.findOne({id: trigger.id}).populateAll();
          event.triggers[j] = trigger;
        }
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json({events:events});
      }
      else {
        // Display the welcome view.
        return exits.success({events:events});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

