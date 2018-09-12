module.exports = {

  friendlyName: 'application get',

  description: 'Get information about the application',

  inputs: {
    name: {
      description: 'Name of the Application',
      type: 'string',
      required: true
    },
    mode: {
      description: "results format: json or html",
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'get'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No application with the specified ID was found.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    try {
      let app = await Application.findOne({name: inputs.name});
      if (!app) {
        return exits.notFound('app/list');
      }

      // Display the results
      if (inputs.mode === "json") {
        // Return json
        return exits.json({application: app});
      }
      else {
        // Display the welcome view.
        return exits.success({application: app});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

