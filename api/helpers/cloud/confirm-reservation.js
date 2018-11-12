module.exports = {


  friendlyName: 'Get resources',
  description: 'Get resources from the Cloud Broker',

  inputs: {
    reservation: {
      description: 'reservation to free',
      type: 'ref',
      required: true,
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'Resources',
      outputType: 'ref'
    },
  },


  fn: async function (inputs, exits) {
    let reservation = inputs.reservation;
    reservation = await Reservation.findOne({id: reservation.id}).populateAll();
    let treservations = await Reservation.update({id: reservation.id}, {state: 'Confirmed'}).fetch();
    sails.sockets.broadcast('c3', 'reservation', treservations);
    let resource = null;
    if (reservation.resource) {
      resource = await Resource.findOne({id: reservation.resource.id});
    }
    else {
      let hardware = await Hardware.findOne({id: reservation.hardware.id}).populateAll();

      let iname = hardware.name + reservation.instance.id;
      let request = await Request.findOne({id: reservation.request.id}).populateAll();
      if (request.requirements[0].name) {
        iname = request.requirements[0].name;
      }
      resource = await Resource.create({
        name: iname,
        capacity: reservation.quantity,
        available: reservation.quantity,
        type: hardware.type,
        disabled: false,
        cloud: hardware.cloud.id,
        hardware: hardware.id,
        env: reservation.env.id
      }).fetch();
      await Hardware.update({id: hardware.id}, {
        available: hardware.available - reservation.quantity,
        reserved: hardware.reserved - reservation.quantity
      });
    }
    // Map Resources to "Service Instance"
    // Connect  the ServiceInstances and Resources together.
    await Resource.addToCollection(resource.id, 'instances', reservation.instance.id);
    await ServiceInstance.addToCollection(reservation.instance.id, 'resources', resource.id);
    sails.sockets.broadcast('c3', 'resource', resource);

    return exits.success(resource);
  }
};

