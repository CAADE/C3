module.exports = {

  friendlyName: 'policy destroy',

  description: 'Destroy policy',

  inputs: {
    /* <parameter name>: {
      description: 'The ID of the user to look up.',
      type: '<parameter type>',
      required: true
    },
    */
    name: {
      description: 'Name of the policy to destroy',
      type: 'string',
      required: true
    },
    cloud: {
      description: 'Name of the cloud',
      type: 'string',
      required: false
    },
    env: {
      description: 'Name of the environment',
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
      let options = {name: inputs.name};
      if(inputs.cloud) {
        let cloud = await Cloud.findOne({name:inputs.cloud});
        if(!cloud) {
          return exits.notFound('/notFound');
        }
        options.cloud = cloud.id;
      }
      if(inputs.env) {
        let environ = await Environment.findOne({name:inputs.env});
        if(!environ) {
          return exits.notFound('/notFound');
        }
        options.env = environ.id;
      }
      let policies = await Policy.find(options);
      if (policies.length === 0) {
        return exits.notFound('/notFound');
      }
      policies = await Policy.destroy(options);

      // broadcast change
      sails.sockets.broadcast('c3', 'policy-destroy', policies);

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

