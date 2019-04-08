module.exports = {

  friendlyName: 'env metrics',
  description: 'Get Environment Metrics',

  inputs: {
    id: {
      description: 'id of the environment',
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
      viewTemplatePath: 'dc/graph'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {

    try {
      let retval = {hardware: {}, resources: {}, services: {}, apps: {}, instances: {}};
      let environment = await Environment.findOne({id: inputs.id}).populateAll();
      retval.appInstances = await ApplicationInstance.find({env: environment.id}).populateAll();
      retval.servicelets = await Servicelet.find({env: environment.id}).populateAll();
      retval.stacks = await Stacklet.find({env: environment.id}).populateAll();
      retval.resources = await Resource.find({env: environment.id}).populateAll();
      retval.services = await Service.find({env: environment.id}).populateAll();
      let instances = await ServiceInstance.find({env: environment.id}).populateAll();

      retval.clouds = environment.clouds;
      let cids = [];
      for (let i in retval.clouds) {
        cids.push(retval.clouds[i].id);
      }

      for (let i in instances) {
        let instance = instances[i];
        if (!retval.instances.hasOwnProperty(instance.state)) {
          retval.instances[instance.state] = 0;
        }
        retval.instances[instance.state]++;
      }
      let hardware = await Hardware.find({cloud: cids});
      for (let i = 0; i < hardware.length; i++) {
        let hw = hardware[i];
        if (!retval.hardware.hasOwnProperty(hw.type)) {
          retval.hardware[hw.type] = {total: 0, available: 0, capacity: 0};
        }
        retval.hardware[hw.type].total++;
        retval.hardware[hw.type].available += hw.available;
        retval.hardware[hw.type].capacity += hw.capacity;
      }
      // let util = Math.round(100 - 100 * (retval.hardware.compute.available / retval.hardware.compute.capacity));
      // await sails.helpers.setEvents('util', util);

      let resources = await Resource.find();
      for (let i = 0; i < resources.length; i++) {
        let resource = resources[i];
        if (!retval.resources.hasOwnProperty(resource.type)) {
          retval.resources[resource.type] = {total: 0, available: 0, capacity: 0};
        }
        retval.resources[resource.type].total++;
        retval.resources[resource.type].available += resource.available;
        retval.resources[resource.type].capacity += resource.capacity;
      }
      for (let index in retval.envs) {
        let env = retval.envs[index];
        env.stacklets = await Stacklet.count({env: env.id});
        env.serviceslets = await Servicelet.count({env: env.id});
        env.applets = await ApplicationInstance.count({env: env.id});
      }
      retval.events = await Events.find();
      retval.policies = await Policy.find();
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(retval);
      }
      else {
        // Display the welcome view.
        return exits.success(retval);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

