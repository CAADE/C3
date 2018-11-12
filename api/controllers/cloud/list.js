module.exports = {

  friendlyName: 'cloud list',
  description: 'List the Clouds',

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
      viewTemplatePath: 'cloud/list'
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
    // Register for socket events from the client
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'c3');
    }

    try {
      let clouds = await Cloud.find().populateAll();

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(clouds);
      }
      else {
        // Display the welcome view.
        let hw = {};
        for(let i in clouds) {
          let cloud = clouds[i];
          for(let j in cloud.hardware) {
            let hard = cloud.hardware[j];
            if(!hw.hasOwnProperty(hard.type)) {
              hw[hard.type] = 0;
            }
            hw[hard.type] += hard.capacity;
          }
          clouds[i].hardware = hw;
        }
        return exits.success({clouds:clouds});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

