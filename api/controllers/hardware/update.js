module.exports = {

  friendlyName: 'hardware update',

  description: 'Add description',

  inputs: {
    name: {
      description: 'name of the Hardware to update',
      type: 'string',
      required: true
    },
    cloud: {
      description: 'Cloud that the hardware is installed',
      type: 'string',
      required: true
    },
    type: {
      description: 'type of the Hardware to update',
      type: 'string',
      required: false
    },
    capacity: {
      description: 'capacity of the Hardware',
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
      let item = await Hardware.findOrCreate({name:inputs.name}, {name:inputs.name});
      item = await Hardware.update({id:item.id}, {
        name:inputs.name,
        type:inputs.type,
        capacity:inputs.capacity
      });
      item = item[0];

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

