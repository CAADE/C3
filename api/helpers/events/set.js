module.exports = {
  friendlyName: 'Set Events value',
  description: 'Set Events value',

  inputs: {
    events: {
      description: 'Events',
      type: 'ref',
      required: true
    },
    value: {
      description: 'value of the Events',
      type: 'number',
      required: false
    },
  },
  exits: {
    success: {
      responseType: 'model',
    },
    notEnoughResource: {
      description: 'Not enough resources available'
    },
    notFound: {
      description: 'Events no found!'
    }
  },


  fn: async function (inputs, exits) {
    try {
      let event = inputs.events;
      if (typeof event === 'string') {
        event = await Events.findOrCreate({name: inputs.events}, {name: inputs.events, value: 0});
      }
      event = await Events.update({id: event.id}, {value: inputs.value}).fetch();
      event = await Events.findOne({id: event.id}).populateAll();
      sails.sockets.broadcast('c3', 'events', event);
      await sails.helpers.events.handle(event);
      return exits.success(event[0]);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};

