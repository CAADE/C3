module.exports = {

  friendlyName: 'Change State of the Service Instance',
  description: 'Change State of the Service Instance',

  inputs: {
    state: {
      description: 'State of the Service Instance',
      type: 'string',
      required: true
    },
    service: {
      description: 'Service to make the transition',
      type: 'ref',
      required: true
    },
  },

  exits: {},

  fn: async function (inputs, exits) {

    let service = inputs.service;
    if (typeof inputs.service === 'string') {
      service = await Service.findOne({name: inputs.service}).populateAll();
    }
    let state = ServiceState.findOne({service: service.id, name: inputs.state}).populateAll();
    if (!state) {
      return exits.notFound('State not Found:', inputs.state);
    }
    await Service.update({id: service.id}, {message: 'Initializing ' + state.name + ' Transition'});
    for (let i in state.actions) {
      try {
        await eval(state.actions[i]);
      }
      catch (e) {
        console.error('Action Error: ', e);
      }
    }
    await Service.update({id: service.id}, {
      currentState: state.id,
      message: 'Completed ' + state.name + ' State transition'
    });
    sails.sockets.broadcast('c3', 'service', service);
    return exits.success(service);
  }
};

