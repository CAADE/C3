module.exports = {

  friendlyName: 'cloud list',
  description: 'List the Clouds',

  inputs: {
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'cloud/list'
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
    // Register for socket events from the client
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'c3');
    }

    try {
      let clouds = await Cloud.find().populateAll();

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(clouds);
      }
      else {
        // Display the welcome view.
        for (let i in clouds) {
          let hw = {};
          let rs = {};
          clouds[i].services = 0;
          let cloud = clouds[i];
          let resources = await Resource.find({cloud: cloud.id}).populateAll();
          for (let j in resources) {
            let resource = resources[j];
            if (!rs.hasOwnProperty(resource.type)) {
              rs[resource.type] = {amount: 0, capacity: 0, available: 0};
            }
            rs[resource.type].capactiy += resource.capacity;
            rs[resource.type].available += resource.available;
            rs[resource.type].amount++;
            if (resource.type === 'compute') {
              clouds[i].services += resource.instances.length;
            }
          }
          for (let j in cloud.hardware) {
            let hard = cloud.hardware[j];
            if (!hw.hasOwnProperty(hard.type)) {
              hw[hard.type] = {amount:0, capacity:0, available:0};
            }
            hw[hard.type].amount++;
            hw[hard.type].capacity += hard.capacity;
            hw[hard.type].available += hard.available;
          }
          clouds[i].resources = rs;
          clouds[i].hardware = hw;
        }
        return exits.success({clouds: clouds});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

