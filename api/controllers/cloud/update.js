module.exports = {

  friendlyName: 'cloud update',

  description: 'Update a Cloud',

  inputs: {
    name: {
      description: 'Name of the Cloud',
      type: 'string',
      required: true
    },
    type: {
      description: 'Type of Cloud',
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

      cloud = await Cloud.update({id:cloud.id}, {type:inputs.type}).fetch();

      // Broadcast change
      sails.sockets.broadcast('c3', 'cloud', cloud);

      if(cloud.length >0) {
        cloud = cloud[0];
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
      else {
        return exits.notFound('/notFound');
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

