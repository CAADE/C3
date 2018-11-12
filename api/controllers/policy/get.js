module.exports = {

  friendlyName: 'policy get',

  description: 'Add description',

  inputs: {
    id: {
      description: 'The ID of the policy to look up.',
      type: 'string',
      required: false
    },
    name: {
      description: 'The name of the policy to look up.',
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
      viewTemplatePath: 'policy/get'
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
      let item;
      if(inputs.id) {
        item = await Policy.findOne({id: inputs.id}).populateAll();
      }
      else if (inputs.name) {
        item = await Policy.findOne({id:inputs.name}).populateAll();
      }
      if (!item) {
        return exits.notFound('/notFound');
      }

      for(let i in item.triggers) {
        let trigger = item.triggers[i];
        trigger = await Trigger.findOne({id:trigger.id}).populateAll();
        item.triggers[i] = trigger;
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json({policy:item});
      }
      else {
        // Display the welcome view.
        return exits.success({policy: item});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

