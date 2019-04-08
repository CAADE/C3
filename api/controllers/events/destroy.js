module.exports = {

  friendlyName: 'events destroy',
  description: 'Destroy Events',
  inputs: {
    name: {
      description: 'name of the events',
      type: 'string',
      required: true
    },
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

  fn: async function (inputs, exits) {

    try {
      let item = await Events.findOne({name: inputs.name});
      if (!item) {
        return exits.notFound('/notFound');
      }

      item = await Events.destroy({id: item.id}).fetch();
      sails.sockets.broadcast('c3', 'events-destroy', item);

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(item[0]);
      }
      else {
        // Display the welcome view.
        return exits.success(item[0]);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

