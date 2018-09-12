module.exports = {

  friendlyName: 'events set',
  description: 'Set Events to specificed amount',
  inputs: {
    name: {
      description: 'name of event',
      type: 'string',
      required: true
    },
    amount: {
      description: 'amount to set the event',
      type: 'number',
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
      let events = await Events.findOne({name: inputs.name});
      if (!events) {
        return exits.notFound('/notFound');
      }
      events = await Events.update({id: events.id}, {value: inputs.amount}).fetch();
      sails.sockets.broadcast('c3', 'events', events);
      await sails.helpers.events.handle(events);

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(events[0]);
      }
      else {
        // Display the welcome view.
        return exits.success(events[0]);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

