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

  fn: async function (inputs, exits, env) {

    try {
      let cloud;
      let environ;
      let options = {name: inputs.name, state:'enabled'};

      if (inputs.cloud) {
        cloud = await Cloud.findOne({name: inputs.cloud});
        if (!cloud) {
          return exits.notFound('/notFound');
        }
        options.cloud = cloud.id;
      }
      if (inputs.env) {
        environ = await Environment.findOne({name: inputs.env});
        if (!environ) {
          return exits.notFound('/notFound');
        }
        options.env = environ.id;
      }
      let policy = await Policy.findOrCreate({name: inputs.name}, options);

      // Now create the resources in the cloud for the application.
      let data = this.req.body.policy;
      let i = 0;
      for (let id in data.triggers) {
        let name = inputs.name + i;
        let tdata = data.triggers[id];
        let trigger = await sails.helpers.trigger.create.with({
          name: name,
          events: tdata.events,
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
      return exits.error(e);
    }
  }
};

