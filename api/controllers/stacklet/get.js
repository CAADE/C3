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
      description: 'Get the complete Definition',
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
      let stacklet = await Stacklet.findOne({id: inputs.id}).populateAll();
      if (!stacklet) {
        return exits.notFound();
      }

      // Display the results
      if (inputs.mode === 'json') {
        for (let i in stacklet.servicelets) {
          let servicelet = stacklet.servicelets[i];
          if (inputs.deep) {
            servicelet = await getServicelet(servicelet);
            stacklet.servicelets[i] = servicelet;
          }
        }
        // Return json
        return exits.json({stacklet: stacklet});
      }
      else {
        // Display the welcome view.
        for (let i in stacklet.servicelets) {
          let servicelet = stacklet.servicelets[i];
          servicelet = await Servicelet.findOne({id: servicelet.id}).populateAll();
          stacklet.servicelets[i] = servicelet;
        }
        return exits.success({stacklet: stacklet});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  },

  getServicelet: async function (servicelet) {
    let retval = null;
    retval = await Servicelet.findOne({id: servicelet.id}).populateAll();
    retval.stacklet = await Stacklet.findOne({id: reval.stacklet.id}).populateAll();
    for (let i in retval.stacklet.servicelets) {
      retval.stacklet.servicelets[i] = await getServicelet(retval.stacklet.servicelets[i]);
    }
    return retval;
  }
};

