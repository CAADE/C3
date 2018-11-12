module.exports = {


  friendlyName: 'Get resources',
  description: 'Get resources from the Cloud Broker',

  inputs: {
    requests: {
      description: 'resource requests',
      type: 'ref',
      required: true
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'Resources',
      outputType: 'ref'
    },
  },


  fn: async function (inputs, exits) {
    ////////////////////////////
    // Use Policy to determine which cloud to get the resources for the request.
    // Get resources.
    // Inputs.requests is in the following format
    // request = { instance: serviceInstance, requirements: [
    //    {type: 'compute', quantity},
    //    {name: 'storage1', quantity: 100},
    //    {name: 'network1', quantity: 2},
    // ]};
    // Format of the resource mapping will be
    // resources =[ {instance: serviceInstance.id, resources: [id1, id2, id3]}, ... ]

    // Evaluate Policies in the Policy Engine

    let requests = await sails.helpers.policy.evaluate.with({requests: inputs.requests});

    // For each request get the environment and ask the environment for reservations.
    // Iterate the cloud and ask for reservations.
    let reservations = [];
    let reservers = await sails.helpers.env.getReservations.with({requests: requests});
    for (j in reservers) {
      reservations.push(reservers[j]);
    }
    ////////////////////////////////////////////////////////////////////////////////
    // Evaluate Reservations
    // Create a map of reservations based on instances.
    let maps = {};
    for (let i in reservations) {
      let reserve = reservations[i];
      if (!maps.hasOwnProperty(reserve.request)) {
        maps[reserve.request] = [];
      }
      maps[reserve.request].push(reserve);
    }
    // TODO: Need to figure out how to evaluate the reservations.
    // First evaluation should be to randomly prune the responses and only leave one per requirement.
    let resources = [];
    for (let iid in maps) {
      let entry = maps[iid];
      // TODO: Insert Adaptor for Selection Criteria
      // Dummy Selector is to grab the first one.
      for (let rid in entry) {
        if (rid === '0') {
          let resource = await sails.helpers.cloud.confirmReservation.with({reservation: entry[0]});
          resources.push(resource);
          let trequests = await Request.update({id: entry.request}, {state: 'Selected'}).fetch();
          sails.sockets.broadcast('c3', 'request', trequests);
        }
        else {
          // For Reservations not selected. Destroy Reservations
          await sails.helpers.cloud.freeReservation.with({reservation: entry[rid]});
        }
      }
    }

    // TODO: Call the Provision Engine to deploy software on the resource.
    return exits.success(resources);
  }

};

