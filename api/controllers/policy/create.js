module.exports = {

  friendlyName: 'policy create',

  description: 'Create a policy for a cloud, environment, or globally',

  inputs: {
    name: {
      description: 'Name of the policy to create',
      type: 'string',
      required: true
    },
    cloud: {
      description: 'Name of the cloud to apply the policy',
      type: 'string',
      required: false
    },
    env: {
      description: 'Name of the enrionment to apply the policy',
      type: 'string',
      required: false
    },
    stack: {
      description: 'Name of the stack to apply the policy',
      type: 'string',
      required: false
    },
    app: {
      description: 'Name of the application to apply the policy',
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

  fn: async function (inputs, exits) {

    try {
      let options = {name: inputs.name, state: 'enabled'};

      if (inputs.cloud) {
        let cloud = await Cloud.findOne({name: inputs.cloud});
        if (!cloud) {
          console.error('Could not find Cloud:', inputs.cloud);
          return exits.notFound('/notFound');
        }
        options.cloud = cloud.id;
      }
      if (inputs.env) {
        let environ = await Environment.findOne({name: inputs.env});
        if (!environ) {
          console.error('Could not find Environment:', inputs.env);
          return exits.notFound('/notFound');
        }
        options.env = environ.id;
      }
      if (inputs.stack) {
        let stack = await ServiceStack.findOne({name: inputs.stack});
        if (!stack) {
          console.error('Could not find ServiceStack:', inputs.stack);
          return exits.notFound('/notFound');
        }
        options.stack = stack.id;
      }
      if (inputs.app) {
        let app = await Application.findOne({name: inputs.app});
        if (!app) {
          console.error('Could not find Application:', inputs.app);
          return exits.notFound('/notFound');
        }
        options.app = app.id;
      }
      console.log('Options:', options);
      let policy = await Policy.findOrCreate({name: inputs.name}, options);


      // Now create the resources in the cloud for the application.
      let data = this.req.body.policy;
      let i = 0;
      for (let id in data.triggers) {
        let name = inputs.name + i;
        let tdata = data.triggers[id];
        await sails.helpers.trigger.create.with({
          name: name,
          event: tdata.events,
          condition: tdata.condition,
          action: tdata.action,
          policy: policy.id,
        });
        i++;
      }
      policy = await Policy.findOne({id: policy.id}).populateAll();
      sails.sockets.broadcast('fleet', 'policy', [policy]);
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(policy);
      }
      else {
        // Display the welcome view.
        return exits.success(policy);
      }
    }
    catch (e) {
      console.error('Error:', e);
      return exits.error(e);
    }
  }
};

