
module.exports = {

  friendlyName: 'hardware list',

  description: 'List Hardware per cloud',

  inputs: {
    cloud: {
      description: 'Cloud that the hardware is installed',
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
      let item;

      if(inputs.cloud) {
        let cloud = await Cloud.findOne({name:inputs.cloud});
        if(!cloud) {
          return exits.notFound('/notFound');
        }
        item = await Hardware.find({cloud:cloud.id}).populateAll();
      }
      else {
        item = await Hardware.find().populateAll();
      }

      // Display the results
      if(inputs.mode === 'json') {
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

