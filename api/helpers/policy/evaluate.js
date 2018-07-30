module.exports = {


  friendlyName: 'Evaluate policies',
  description: 'Evaluate Policys of the Requests',

  inputs: {
    requests: {
      description: 'requests to evaluate',
      type: 'ref',
      required: true,
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'requests',
      outputType: 'ref'
    },
  },


  fn: async function (inputs, exits) {
    let requests = inputs.requests;
    let ids = [];
    for(let i in requests) {
      ids.push(requests[i].id);
    }
    requests = await Request.update({id: ids}, {state:'Evaluated'}).fetch();
    sails.sockets.broadcast('c3', 'request', requests);
    return exits.success(requests);
  }
};

