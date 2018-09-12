module.exports = {


  friendlyName: 'Get resources',
  description: 'Get resources from the Cloud Broker',

  inputs: {
    cloud: {
      description: 'cloud to get reservations from',
      type: 'ref',
      required: true,
    },
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
    let cloud = inputs.cloud;

    let hardware = [];
    let reservations = [];

    // Check if there is any hardware. If not return empty reservations.
    hardware = await Hardware.find({cloud: cloud.id});
    if (hardware.length === 0) {
      return exits.success(reservations);
    }
    // Iterate over the reservations. And find out what hardware is available.
    for (let i in inputs.requests) {
      let request = await Request.findOne({id: inputs.requests[i].id}).populateAll();

      for (let j in request.requirements) {
        let requirement = request.requirements[j];
        let resources = [];
        if (requirement.hasOwnProperty('name')) {
          // if name is there then look for a resource with that name.
          resources = await Resource.find({cloud: cloud.id, name: requirement.name});
          if(resources.length > 0) {
            let reservation = await Reservation.create({
              requirement: requirement.id,
              instance: request.instance.id,
              request: request.id,
              resource: resources[0].id,
              quantity: requirement.quantity,
              state: 'Created',
              cost: 0.01
            }).fetch();
            reservations.push(reservation);
          }
        }
        if (resources.length < 1 && requirement.hasOwnProperty('type')) {
          hardware = await Hardware.find({cloud: cloud.id, type: requirement.type, disabled: false});
        }
        hardware = _.sortBy(hardware, 'available').reverse();
        let hi = 0;
        while (hi < hardware.length) {
          if (requirement.quantity <= hardware[hi].available - hardware[hi].reserved) {
            let reservation = await Reservation.create({
              requirement: requirement.id,
              instance: request.instance.id,
              request: request.id,
              hardware: hardware[hi].id,
              quantity: requirement.quantity,
              state: 'Created',
              cost: 0.01
            }).fetch();
            sails.sockets.broadcast('c3', 'reservation', [reservation]);
            await Hardware.update({id: hardware[hi].id}, {reserved: requirement.quantity});
            reservations.push(reservation);
            let trequests = await Request.update({id:request.id}, {state:'Satisfied'}).fetch();
            sails.sockets.broadcast('c3', 'request', trequests);

            // force a break without calling a break. break might break out of the higher loops.
            hi = hardware.length;
          }
          hi++;
        }
      }
    }
    // Now iterate over the hardware and see what is available for each request.
    // Create a rservation connecting the hardware and request together.
    return exits.success(reservations);
  }
};

