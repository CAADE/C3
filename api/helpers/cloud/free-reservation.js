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
    let reservation = await Reservation.findOne({id: inputs.reservation.id}).populateAll();
    let treservations = await Reservation.update({id: reservation.id}, {state: 'Rejected'}).fetch();
    if (reservation.hardware) {
      let reserved = reservation.hardware.reserved - reservation.quantity;
      if (reserved < 0) {
        reserved = 0;
      }
      await Hardware.update({id: reservation.hardware.id}, {reserved: reserved});
    }
    sails.sockets.broadcast('c3', 'reservation', treservations);
    return exits.success();
  }
};

