module.exports = {

  friendlyName: 'env get',

  description: 'Add description',

  inputs: {
    name: {
      description: 'Description of Attribute',
      type: 'string',
      required: false
    },
    id: {
      description: 'ID of the Environment',
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
      viewTemplatePath: 'env/get'
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
      let environment = null;
      if (inputs.id) {
        environment = await Environment.find({id: inputs.id}).populateAll();
      }
      if (!environment && inputs.name) {
        environment = await Environment.find({name: inputs.name}).populateAll();
      }
      if (environment.length < 1) {
        return exits.notFound('/notFound');
      }

      let apps = await ApplicationInstance.find({env: environment[0].id}).populateAll();
      let services = await ServiceInstance.find({env: environment[0].id}).populateAll();
      let resources = await Resource.find({env: environment[0].id}).populateAll();
      let policies = await Policy.find({env: environment[0].id}).populateAll();

      for (let i in apps) {
        let app = apps[i];
        let services = [];
        for (let j in app.services) {
          let service = app.services[j];
          services.push(await getServices(service));
        }
        app.services = services;
      }

      environment[0].apps = apps;
      environment[0].services = services;
      environment[0].resources = resources;
      environment[0].policies = policies;

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json({env: environment[0]});
      }
      else {
        // Display the welcome view.
        return exits.success({env: environment[0]});
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

