module.exports = {

  friendlyName: 'policy update',

  description: 'Add description',

  inputs: {
    name: {
      description: 'Description of Attribute',
      type: 'string',
      required: true
    },
    cloud: {
      description: 'Description of Attribute',
      type: 'string',
      required: true
    },
    env: {
      description: 'Description of Attribute',
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
      let options = {name: inputs.name};

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
      await Policy.update({id: policy.id}, options);
      policy = await Policy.findOne({id:policy.id}).populateAll();

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

