module.exports = {

  friendlyName: 'stack get',

  description: 'Add description',

  inputs: {
    id: {
      description: 'The ID of the stack to look up.',
      type: 'number',
      required: true
    },
    deep: {
      description: 'Get the complete tree',
      type: 'boolean',
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
      viewTemplatePath: 'stack/get'
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
      let stack = await ServiceStack.findOne({id: inputs.id}).populateAll();
      if (!stack) {
        return exits.notFound();
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        for (let i in stack.stacklets) {
          let stacklet = stack.stacklets[i];
          stacklet = await Stacklet.findOne({id: stacklet.id}).populateAll();
          let servicelets = [];
          for (let j in stacklet.servicelets) {
            servicelets.push(await getServicelet(stacklet.servicelets[j]));
          }
          stacklet.servicelets = servicelets;
          stack.stacklets[i] = stacklet;
        }
        return exits.json({stack: stack});
      }
      else {
        // Display the welcome view.
        for (let i in stack.stacklets) {
          let stacklet = stack.stacklets[i];
          stacklet = await Stacklet.findOne({id: stacklet.id}).populateAll();
          stack.stacklets[i] = stacklet;
        }
        return exits.success({stack: stack});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  },
};

async function getServicelet(servicelet) {
  let retval = null;
  retval = await Servicelet.findOne({id: servicelet.id}).populateAll();
  retval.stack = await ServiceStack.findOne({id: retval.stack.id}).populateAll();
  let stacklet = await Stacklet.findOne({stack: retval.stack.id, env: retval.env.id}).populateAll();
  if(stacklet) {
    retval.stack.stacklet = stacklet;
    // for each servicelet get the servicestack then the stacklet and then its. Servicelets.
    for (let i in retval.stack.stacklet.servicelets) {
      let child = retval.stack.stacklet.servicelets[i];
      retval.stack.stacklet.servicelets[i] = await getServicelet(child);
    }
  }
  return retval;
}

