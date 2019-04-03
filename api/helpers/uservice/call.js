module.exports = {
  friendlyName: 'uservice oneway',
  description: 'Make request of uservice non-blocking',
  inputs: {
    uservice: {
      description: 'uservice name',
      type: 'string',
      required: true,
    },
    method: {
      description: 'method',
      type: 'string',
      required: true
    },
    callback: {
      description: 'callback',
      type: 'ref',
      required: false
    }
  },
  exits: {},


  fn: async function (inputs, exits) {
    let requests = [];
    // Iterate through the requests and provision software on the resources.

    for (let i in inputs.requests) {
      let request = await Request.findOne({id: inputs.requests[i].id}).populateAll();
      requests.push(request);

      if (request.state === 'Selected') {
        await Request.update({id: request.id}, {state: 'Completed'});
        let instances = await ServiceInstance.update({id: request.instance.id}, {state: 'Deploying'}).fetch();
        sails.sockets.broadcast('c3', 'sinstance', instances);
        // TODO: Do some work here to deploy the software.
        let consumption = instances[0].consumption;
        if (!consumption) {
          consumption = {};
        }
        for (let i in request.requirements) {
          consumption[i] = request.requirements[i];
        }
        instances = await ServiceInstance.update({id: request.instance.id}, {
          consumption: consumption,
          state: 'Running'
        }).fetch();
        sails.sockets.broadcast('c3', 'sinstance', instances);
      }
    }

    return exits.success(requests);
  }
};

