module.exports = {

  friendlyName: 'policy disable',

  description: 'Add description',

  inputs: {
    name: {
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

  fn: async function (inputs, exits) {

    try {
      let policy = await Policy.findOne({name: inputs.name});
      if (!policy) {
        return exits.notFound('/notFound');
      }
      await Policy.update({id: policy.id}, {state: 'disabled'});
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

