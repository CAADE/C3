module.exports = {

  friendlyName: 'stack list',
  description: 'List Stacks',
  inputs: {
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'stack/list'
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
      let stacks = await ServiceStack.find().populateAll();
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(stacks);
      }
      else {
        // Display the welcome view.
        for (let j in stacks) {
          let stack = stacks[j];
          for (let i in stack.stacklets) {
            let stacklet = stack.stacklets[i];
            stacklet = await Stacklet.findOne({id: stacklet.id}).populateAll();
            stack.stacklets[i] = stacklet;
          }
        }
        return exits.success({stacks: stacks});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

