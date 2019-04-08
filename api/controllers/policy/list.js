module.exports = {

  friendlyName: 'policy list',

  description: 'Add description',

  inputs: {
    cloud: {
      description: 'Description of Attribute',
      type: 'string',
      required: false
    },
    env: {
      description: 'Description of Attribute',
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
      viewTemplatePath: 'policy/list'
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

    // Connect to the socket room.
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'c3');
    }

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
      let policies = await Policy.find(options).populateAll();
      for (let i in policies) {
        let policy = policies[i];
        for (let j in policy.triggers) {
          let trigger = policy.triggers[j];
          trigger = await Trigger.findOne({id: trigger.id}).populateAll();
          policy.triggers[j] = trigger;
        }
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(policies);
      }
      else {
        // Display the welcome view.
        return exits.success({policies: policies});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

