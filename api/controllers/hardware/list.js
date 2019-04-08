module.exports = {

  friendlyName: 'hardware list',

  description: 'List Hardware per cloud',

  inputs: {
    cloud: {
      description: 'Cloud that the hardware is installed',
      type: 'string',
      required: false
    },
    type: {
      description: 'Type of Hardware',
      type: 'string',
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
      viewTemplatePath: 'hardware/list'
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
      let query = {};

      if (inputs.cloud) {
        let cloud = await Cloud.findOne({name: inputs.cloud}).populateAll();

        if (!cloud) {
          return exits.notFound('/notFound');
        }
        else {
          query.cloud = cloud.id;
        }
        item = await Hardware.find({cloud: cloud.id}).populateAll();
      }
      if (inputs.type) {
        query.type = inputs.type;
      }
      let hardware = await Hardware.find(query).populateAll();

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json({hardware:hardware});
      }
      else {
        // Display the welcome view.
        return exits.success({hardware: hardware});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

