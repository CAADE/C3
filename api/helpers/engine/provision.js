module.exports = {


  friendlyName: 'Provision service in the request',


  description: 'Provision service on the resource assigned to the request',


  inputs: {
    requests: {
      description: 'requests',
      type: 'ref',
      required: true
    },
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


        instance = await ServiceInstance.update({id: request.instance.id}, {state: 'Running'}).fetch();
        sails.sockets.broadcast('c3', 'sinstance', instances);
      }
    }

    return exits.success(requests);
  }
};

