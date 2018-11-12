module.exports = {

  friendlyName: 'instance get',

  description: 'Add description',

  inputs: {
    ids: {
      description: 'IDs of the Application Instance',
      type: 'string',
      required: false
    },
    id: {
      description: 'ID of the Application Instances',
      type: 'number',
      required: false
    },
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
      viewTemplatePath: 'instance/get'
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
      if(inputs.ids) {
        let ids = inputs.ids.split(/,/);
        let instances = await ApplicationInstance.find({id: ids}).populateAll();
        return exits.json({instances: instances});
      }
      else {
        let instance = await ApplicationInstance.findOne({id: inputs.id}).populateAll();
        if (!instance) {
          return exits.notFound('/signup');
        }

        // Display the results
        if (inputs.mode === 'json') {
          // Return json
          let services = [];
          for (let j in instance.services) {
            let service = instance.services[j];
          }
          instance.services = services;
          return exits.json({instance: instance});
        }
        else {
          // Display the welcome view.
          let services = [];
          for (let j in instance.services) {
            let service = instance.services[j];
            services.push(await getServices(service));
          }
          instance.services = services;
          return exits.success({instance: instance});
        }
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
    instances.push(instance);
  }
  retval.instances = instances;
  return retval;
}
