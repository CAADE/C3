module.exports = {
  friendlyName: 'register microservice',
  description: 'Register a MicroService',
  inputs: {
    name: {
      description: 'name of the Uservice',
      type: 'string',
      required: true
    },
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
    sails.sockets.join(this.req, 'c3');
    console.log("Registered:", inputs.name);
    return exits.json({msg:"Connected on C3"});
  }
};

