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
    let requests = await sails.helpers.policy.evaluate.with({requests:inputs.requests});

    // Iterate the cloud and ask for reservations.
    let clouds = await Cloud.find();
    let reservations = [];
    for(let i in clouds) {
      // Connect to the cloud and then ask it for a set of reservations from the requests.
      let cloud = clouds[i];
      let reservers = await sails.helpers.cloud.getReservations.with({cloud:cloud, requests:requests});
      reservations.push(reservers);
    }
    // Evaluate Reservations
    // Select Reservations
    // Map Resources to "Service Instance"
    // Call the Provision Engine to deploy software on the resource.

    // Destroy Reservations
    let resources = [];

    for(let i in inputs.requests) {
      let request = inputs.requests[i];
      let response = {instance:request.instance, resources: [] };
      console.log('response:', response);
      for(let j in request.requirements) {
        let requirement = request.requirements[j];
        console.log('Requirement', requirement);

        // response.resources.push(resource.id);
      }
      resources.push(response);
    }
    // Send back the result through the success exit.
    return exits.success(resources);
  }

};

