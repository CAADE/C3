module.exports = {

  friendlyName: 'cloud get',

  description: 'Get information about the clouds',

  inputs: {
    name: {
      description: 'name of the Cloud',
      type: 'string',
      required: false
    },
    id: {
      description: 'ID of the Cloud',
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
      viewTemplatePath: 'cloud/get'
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
      let cloud = null;
      if (inputs.id) {
        cloud = await Cloud.find({id: inputs.id}).populateAll();
      }
      if (!cloud && inputs.name) {
        cloud = await Cloud.find({name: inputs.name}).populateAll();
      }
      if (cloud.length < 1) {
        return exits.notFound('/notFound');
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(cloud[0]);
      }
      else {
        // Get statistics from the Hardware.
        let hw = {};
        for (let i in cloud[0].hardware) {
          let hardware = cloud[0].hardware[i];
          if (!hw.hasOwnProperty(hardware.type)) {
            hw[hardware.type] = {reserved: 0, capacity: 0, available: 0, number:0, used:0};
          }
          hw[hardware.type].number++;
          // this is the total number of cores or resource used.
          if (hardware.capacity - hardware.available > 0) {
            hw[hardware.type].used++;
          }
          hw[hardware.type].reserved += hardware.reserved;
          hw[hardware.type].capacity += hardware.capacity;
          hw[hardware.type].available += hardware.available;
        }
        cloud[0].hardware = hw;

        // Get all of the resources. And the serviceInstance running on the Resources.
        let rs = {};
        let services = {};
        let resources = await Resource.find({cloud: cloud[0].id}).populateAll();
        for (let i in resources) {
          let resource = resources[i];
          if (!rs.hasOwnProperty(resource.type)) {
            rs[resource.type] = {number: 0, capacity: 0, available: 0, used: 0, disabled: 0};
          }
          rs[resource.type].number++;
          if(resource.capacity - resource.available > 0) {
            rs[resource.type].used++;
          }
          if (resource.state === 'disabled') {
            rs[resource.type].disabled++;
          }
          else {
            rs[resource.type].enabled++;
          }
          rs[resource.type].capacity += resource.capacity;
          rs[resource.type].available += resource.available;
          if(resource.type === 'compute') {
            for (let j in resource.instances) {
              let instance = resource.instances[j];
              if (!services.hasOwnProperty(instance.state)) {
                services[instance.state] = 0;
              }
              services[instance.state]++;
            }
          }
        }
        cloud[0].resources = rs;
        cloud[0].services = services;

        return exits.success({cloud: cloud[0]});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

