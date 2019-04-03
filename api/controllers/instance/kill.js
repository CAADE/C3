
module.exports = {

  friendlyName: 'instance kill',

  description: 'Add description',

  inputs: {
    id: {
      description: 'ID of the instance to kill',
      type: 'number',
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
      let appI = await ApplicationInstance.findOne(inputs.id);
      if (!appI) {return exits.notFound('/home');}
      let instances = await sails.helpers.app.kill.with({instance:appI});

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json({instance: appI});
      }
      else {
        // Display the welcome view.
        return exits.success({name: user.name});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

