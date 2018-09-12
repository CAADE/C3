module.exports = {

  friendlyName: 'app kill',

  description: 'Add description',

  inputs: {
    name: {
      description: 'Name of the Application',
      type: 'string',
      required: true
    },
    signal: {
      description: 'Kill signal',
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
      let app = await Application.findOne({name: inputs.name});
      if (!app) {
        return exits.notFound('/notFound');
      }


      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(app);
      }
      else {
        // Display the welcome view.
        return exits.success(app);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

