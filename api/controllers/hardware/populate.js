
module.exports = {

  friendlyName: 'hardware populate',

  description: 'Add description',

  inputs: {
    cloud: {
      description: 'Cloud that the hardware will be added to',
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
      viewTemplatePath: '/cloud/get'
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
      let cloud = await Cloud.findOne({name:inputs.cloud});
      if (!cloud) {return exits.notFound('/notFound');}
      let hw = this.req.body.hardware;
      let hardware = [];
      for(let name in hw) {
        let item = hw[name];
        item.name = name;
        item.available = item.capacity;
        item.disabled = false;
        item.cloud = cloud.id;
        hardware.push(await Hardware.create(item).fetch());
      }
      console.log(hardware);
      sails.sockets.broadcast('c3', 'hardware', hardware);

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(hardware);
      }
      else {
        // Display the welcome view.
        cloud = await Cloud.findOne({id:cloud.id}).populateAll();
        return exits.success({cloud:cloud});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

