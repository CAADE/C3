module.exports = {

  friendlyName: 'hardware destroy',
  description: 'Destroy Hardware',
  inputs: {
    name: {
      description: 'Name of the hardware to destroy',
      type: 'string',
      required: true
    },
    cloud: {
      description: 'Cloud that the hardware is installed',
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
      let cloud = await Cloud.findOne({name: inputs.cloud});
      if(!cloud) {
        return exits.notFound('/notFound');
      }
      let item = await Hardware.findOne({name: inputs.name});
      if (!item) {
        return exits.notFound('/notFound');
      }
      item = await Hardware.destroy({id: item.id}).fetch();
      item = item[0];
      // broadcast change
      sails.sockets.broadcast('c3', 'hardware-destroy', [item]);

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(item);
      }
      else {
        // Display the welcome view.
        return exits.success(item);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

