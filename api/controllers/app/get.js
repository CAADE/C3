module.exports = {

  friendlyName: 'app get',

  description: 'Add description',

  inputs: {
    name: {
      description: 'Name of the Application',
      type: 'string',
      required: false
    },
    id: {
      description: 'ID of the Application',
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
      viewTemplatePath: 'app/get'
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

    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'c3');
    }

    try {
      let app;

      if (inputs.name) {
        app = await Application.findOne({name: inputs.name}).populateAll();
      }
      else if (inputs.id) {
        app = await Application.findOne({id: inputs.id}).populateAll();
      }
      if (!app) {
        return exits.notFound('/notFound');
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        if (inputs.deep) {
          let instances = [];
          for (let i in app.instances) {
            let instance = app.instances[i];
            instance = await ApplicationInstance.findOne({id: instance.id}).populateAll();
            let services = [];
            for (let j in instance.services) {
              let service = instance.services[j];
              services.push(await getServices(service));
            }
            instance.services = services;
            instances.push(instance);
          }
          app.instances = instances;
        }
        return exits.json({app:app});
      }
      else {
        // Display the welcome view.
        let instances = [];
        for (let i in app.instances) {
          let instance = app.instances[i];
          instance = await ApplicationInstance.findOne({id: instance.id}).populateAll();
          let services = [];
          for (let j in instance.services) {
            let service = instance.services[j];
            services.push(await getServices(service));
          }
          instance.services = services;
          instances.push(instance);
        }
        app.instances = instances;
        return exits.success({app: app});
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

