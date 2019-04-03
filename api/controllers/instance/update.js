module.exports = {
  friendlyName: 'instance update',
  description: 'Update Instance',
  inputs: {
    id: {
      description: 'ID of the instance',
      type: 'number',
      required: false
    },
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'instance/get'
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
      if(inputs.id) {
        console.log("Update:", inputs);
        let instances = await ServiceInstance.update({id:inputs.id}, this.req.body).fetch();
        sails.sockets.broadcast('c3', 'sinstance', instances);
        return exits.json({instances: instances});
      }
      return exits.notFound();
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

