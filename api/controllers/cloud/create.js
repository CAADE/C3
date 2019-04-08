module.exports = {

  friendlyName: 'cloud create',

  description: 'Create a Cloud',

  inputs: {
    name: {
      description: 'name of the Cloud',
      type: 'string',
      required: true
    },
    type: {
      description: 'type of the Cloud (aws,openstack,vmware,gce,...)',
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
      let cloud = await Cloud.findOrCreate({name:inputs.name}, {name:inputs.name, type:inputs.type});

      // Broadcast change
      sails.sockets.broadcast('c3', 'cloud', cloud);

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

