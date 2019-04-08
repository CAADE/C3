module.exports = {

  friendlyName: 'Get Resrevation',
  description: 'Get Reservation from the Cloud',

  inputs: {
    cloud: {
      description: 'cloud to get resources from',
      type: 'ref',
      required: true
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
    notFound: {
      description: 'Resources could not be found',
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
      let request = await Request.findOne({id: inputs.requests[i].id}).populateAll();
      let eid = request.env.id;
      for (let j in request.requirements) {
        let requirement = request.requirements[j];
        let resources = [];

        // Name Resource. Just access it. Don't need add quantity.
        if (requirement.hasOwnProperty('name')) {
          // if name is there then look for a resource with that name.
          // How do I select the resource for the reservation if there is more than one.
          // To I push back all of them as individual reservations?
          resources = await Resource.find({env: eid, cloud: inputs.cloud.id, name: requirement.name});
          if (resources.length > 0) {
            let reservation = await Reservation.create({
              requirement: requirement.id,
              instance: request.instance.id,
              request: request.id,
              resource: resources[0].id,
              quantity: requirement.quantity,
              env: eid,
              state: 'Created',
              cost: 0.01
            }).fetch();
            reservations.push(reservation);
          }
        }
        if (resources.length < 1 && requirement.hasOwnProperty('type')) {
          // First check and see if there are resources that can be re-used.
          let reservation = await getReservationFromResources(envMap[eid], inputs.cloud, request, requirement);
          // If there aren't then create resources.
          if (!reservation) {
            reservation = await getReservationFromHardware(envMap[eid], inputs.cloud, request, requirement);
          }
          if (!reservation) {
            console.error('Could not reserve: ', request, requirement);
            return exits.notFound(request);
          }
          reservations.push(reservation);
        }
      }
    }
    // Now iterate over the hardware and see what is available for each request.
    // Create a rservation connecting the hardware and request together.
    return exits.success(reservations);
  }
};

// TODO: We should try and find Resources first that can be used. Not just hardware.
async function getReservationFromResources(env, cloud, request, requirement) {
  let resources = [];
  let tres = await Resource.find({cloud: cloud.id, type: requirement.type, disabled: false}).populateAll();
  for (let j in tres) {
    resources.push(tres[j]);
  }

  // This should be configurable on how to select a resource for reservation.
  resources = resources.sort((a, b) => b.available - a.available);
  let hi = 0;
  // How many should I push back?
  // Just the first one or a set of the resources returned.
  while (hi < resources.length) {
    if (requirement.quantity <= resources[hi].available) {
      let reservation = await
        Reservation.create({
          requirement: requirement.id,
          instance: request.instance.id,
          request: request.id,
          resource: resources[hi].id,
          quantity: requirement.quantity,
          env: env.id,
          state: 'Created',
          cost: 0.01
        }).fetch();
      sails.sockets.broadcast('c3', 'reservation', [reservation]);
      await Resource.update({id: resources[hi].id}, {reserved: requirement.quantity});
      retval = reservation;
      let trequests = await Request.update({id: request.id}, {state: 'Satisfied'}).fetch();
      sails.sockets.broadcast('c3', 'request', trequests);

      // force a break without calling a break. break might break out of the higher loops.
      hi = resources.length;
      return reservation;
    }
    hi++;
  }
  return null;
}

async function getReservationFromHardware(env, cloud, request, requirement) {

  let clouds = env.clouds;
  let hardware = [];

  let tempHardware = await Hardware.find({cloud: cloud.id, type: requirement.type, disabled: false});
  if (tempHardware.length === 0) {
    console.error('No Hardware Found:', requirement.type, clouds[j].name);
  }
  for (let k in tempHardware) {
    hardware.push(tempHardware[k]);
  }
  hardware = hardware.sort((a, b) => b.available - a.available);
  if (hardware.length === 0 && resources.length < 1) {
    console.error('Could not find hardware for:', requirement);
  }
  let hi = 0;
  while (hi < hardware.length) {
    if (requirement.quantity <= hardware[hi].available - hardware[hi].reserved) {
      let reservation = await
        Reservation.create({
          requirement: requirement.id,
          instance: request.instance.id,
          request: request.id,
          hardware: hardware[hi].id,
          quantity: requirement.quantity,
          env: env.id,
          state: 'Created',
          cost: 0.01
        }).fetch();
      sails.sockets.broadcast('c3', 'reservation', [reservation]);
      let reserved = hardware[hi].reserved + requirement.quantity;
      await Hardware.update({id: hardware[hi].id}, {reserved: reserved});
      let trequests = await Request.update({id: request.id}, {state: 'Satisfied'}).fetch();
      sails.sockets.broadcast('c3', 'request', trequests);

      // force a break without calling a break. break might break out of the higher loops.
      hi = hardware.length;
      return reservation;
    }
    hi++;
  }
  return null;
}
