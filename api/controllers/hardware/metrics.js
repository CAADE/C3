module.exports = {

  friendlyName: 'hardware metrics',
  description: 'Get Hardware metrics of a specific type',
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
    }
  },

  exits: {
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
      let cloud;
      let query = {};

      if (inputs.cloud) {
        cloud = await Cloud.findOne({name: inputs.cloud});
        query.cloud = cloud.id;
      }
      if (inputs.type) {
        query.type = inputs.type;
      }
      let hardware = await Hardware.find(query).populateAll();
      let retval = {hardware: {total: 0}};
      for (let i = 0; i < hardware.length; i++) {
        let hw = hardware[i];
        retval.hardware.total++;
        if (!retval.hardware.hasOwnProperty(hw.type)) {
          retval.hardware[hw.type] = {total: 0, available: 0, capacity: 0, used:0};
        }
        retval.hardware[hw.type].total++;
        retval.hardware[hw.type].available += hw.available;
        retval.hardware[hw.type].capacity += hw.capacity;
        retval.hardware[hw.type].reserved += hw.reserved;
        if(hw.available !== hw.capacity) {
          retval.hardware[hw.type].used++;
        }
      }
      return exits.json(retval);
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

