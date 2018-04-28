module.exports = {

  friendlyName: 'application create',
  description: ' Add description',
  inputs: {
    /* <parameter name>: {
      description: 'The ID of the user to look up.',
      type: '<parameter type>',
      required: true
    },
    */
    name: {
      description: 'Name of the application',
      type: 'string',
      required: true
    },
    stack: {
      description: 'Name of the stack',
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
      viewTemplatePath: 'app/show'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'Stack specified does not exist',
      responseType: 'redirect'
    },
    alreeadyExists: {
      description: 'Application specified already exists',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    try {
      let apps = await Application.find({name: inputs.name});
      if (apps.length > 0) {
        return exits.alreadyExists('app/show');
      }
      let stacks = await ApplicationStack.find({name: inputs.stack});
      if (stacks.length < 1) {
        return exits.notFound('app/create');
      }
      let app = await Application.create({name: inputs.name, stack: stacks[0], version: "0.0.1"});
      if (inputs.mode === "json") {
        return exits.json({name: inputs.name});
      }
      else {
        exits.success({application: app});

      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

