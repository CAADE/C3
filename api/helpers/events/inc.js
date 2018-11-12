module.exports = {
  friendlyName: 'Increment Events value',
  description: 'Increment Events value',

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
    data: {
      description: 'data attached to the event',
      type: 'string',
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
      let updateData = {value:inputs.value};
      if(inputs.data) {
        let data = JSON.parse(inputs.data);
        updateData.data = data;
      }
      if (typeof event === 'string') {
        event = await Events.findOrCreate({name: inputs.events}, {name: inputs.events, value: 0});
      }
      event = await Events.update({id: event.id}, {value: event.value + inputs.value}).fetch();
      event = await Events.find({id: event[0].id}).populateAll();
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

