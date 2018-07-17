module.exports = {

  friendlyName: 'app launch',
  description: 'Launch and Application into a environment with a config',

  inputs: {
    name: {
      description: 'Name of the Application',
      type: 'string',
      required: true
    },
    env: {
      description: 'Name of the Environment',
      type: 'string',
      required: true
    },
    config: {
      description: 'Config of the Application',
      type: 'json',
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

  fn: async function (inputs, exits, env) {

    try {
      let app = await Application.findOne({name:inputs.name}).populateAll();
      if(!app) {
        return exits.notFound('/notFound');
      }
      let environ = await Environment.findOne({name:inputs.env}).populateAll();
      if(!environ) {
        return exits.notFound('/notFound');
      }
      if(!inputs.hasOwnProperty('config')) {
        inputs.config = {};
      }
      let results = await sails.helpers.app.launch.with({app:app, env: environ, config:inputs.config});

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(results);
      }
      else {
        // Display the welcome view.
        return exits.success(results);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

