module.exports = {

  friendlyName: 'instance get',

  description: 'Add description',

  inputs: {
    deep: {
      description: 'Complete Application and application instances',
      type: 'boolean',
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
      viewTemplatePath: 'instance/list'
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
      let instances = await ApplicationInstance.find().populateAll();

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        for (let i in instances) {
          let instance = instances[i];
          let services = [];
          for (let j in instance.services) {
            let service = instance.services[j];
            services.push(await getServices(service));
          }
          instance.services = services;
        }
        return exits.json({instances: instances});
      }
      else {
        // Display the welcome view.
        for (let i in instances) {
          let instance = instances[i];

          let services = [];
          for (let j in instance.services) {
            let service = instance.services[j];
            services.push(await getServices(service));
          }
          instance.services = services;
        }
        return exits.success({instances: instances});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

async function getServices(service) {
  let retval;

  retval = await Service.findOne({id: service.id}).populateAll();
  let children = [];
  for (let i in retval.children) {
    let child = retval.children[i];
    child = await Service.findOne({id: child.id}).populateAll();
    child = await getServices(child);
    children.push(child);
  }
  retval.children = children;

  let instances = [];
  for (let i in retval.instances) {
    let instance = retval.instances[i];
    instance = await ServiceInstance.findOne({id: instance.id}).populateAll();
    let resources = [];
    for(let j in instance.resources) {
      let resource = instance.resources[j];
      resources.push(await Resource.findOne({id:resource.id}).populateAll());
    }
    instance.resources= resources;
    instances.push(instance);
  }
  retval.instances = instances;
  return retval;
}
