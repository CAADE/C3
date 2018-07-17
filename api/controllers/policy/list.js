module.exports = {

  friendlyName: 'policy list',

  description: 'Add description',

  inputs: {
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
      let options = {};

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
      let policies = await Policy.find(options);

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(policies);
      }
      else {
        // Display the welcome view.
        return exits.success(policies);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

