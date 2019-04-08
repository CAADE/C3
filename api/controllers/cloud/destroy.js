module.exports = {

  friendlyName: 'cloud destroy',
  description: 'Destroy a Cloud by name',
  inputs: {
    name: {
      description: 'Name of the cloud',
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
      let cloud = await Cloud.findOne({name: inputs.name});
      if (!cloud) {
        return exits.notFound('/notfound');
      }
      cloud = await Cloud.destroy({name: inputs.name}).fetch();
      // Broadcast change
      sails.sockets.broadcast('c3', 'cloud-destroy', cloud);
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(cloud);
      }
      else {
        // Display the welcome view.
        return exits.success(cloud);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

