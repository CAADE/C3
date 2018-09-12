module.exports = {

  friendlyName: 'hardware create',
  description: 'Create Hardware of a specific type',
  inputs: {
    name: {
      description: 'Name of the hardware',
      type: 'string',
      required: true
    },
    cloud: {
      description: 'Cloud that the hardware is installed',
      type: 'string',
      required: true
    },
    type: {
      description: 'Type of Hardware to be created',
      type: 'string',
      required: true
    },
    capacity: {
      description: 'Capacity of the hardware',
      type: 'number',
      required: false
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

  fn: async function (inputs, exits, env) {
    try {
      if (!inputs.capacity) {
        inputs.capacity = 28;
      }
      let cloud = await Cloud.findOne({name: inputs.cloud});
      if(!cloud) {
        return exits.notFound('/notFound');
      }
      let item = await Hardware.findOrCreate({name: inputs.name}, {
        name: inputs.name,
        type: inputs.type,
        capacity: inputs.capacity,
        available: inputs.capacity,
        state: 'enabled',
        cloud: cloud.id
      });

      // broadcast change
      sails.sockets.broadcast('c3', 'hardware', [item]);

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

