module.exports = {

  friendlyName: 'Get resources',
  description: 'Get resources from the Environment',

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
    notFound: {
      description: 'Resources could be Not Found',
    }
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

    let reservations = [];

    // Create a cache map for speeding things up.
    let envMap = {};
    let envs = await Environment.find().populateAll();
    for (let i in envs) {
      envMap[envs[i].id] = envs[i];
    }
    // Iterate over the reservations. And find out what hardware is available.
    for (let i in inputs.requests) {
      let hardware = [];
      let tres = [];
      let request = await Request.findOne({id: inputs.requests[i].id}).populateAll();
      let eid = request.env.id;
      // Iterate over the clouds for the environment and get a reservation.
      for (let i in envMap[eid].clouds) {
        let cloud = envMap[eid].clouds[i];
        tres.push(await sails.helpers.cloud.getReservations.with({cloud: cloud, requests: [request]}));
      }
      for(let i in tres) {
        for(j in tres[i]) {
          reservations.push(tres[i][j]);
        }
      }
    }
    // Now iterate over the hardware and see what is available for each request.
    // Create a rservation connecting the hardware and request together.
    return exits.success(reservations);
  }
};
