
module.exports = {

  friendlyName: 'reservation list',

  description: 'Resrevation List',

  inputs: {
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'welcome'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No item with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let reservations = await Reservation.find();

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(reservations);
      }
      else {
        // Display the welcome view.
        return exits.success(reservations);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

