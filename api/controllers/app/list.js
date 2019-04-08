module.exports = {

  friendlyName: 'app list',

  description: 'Add description',

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
      viewTemplatePath: 'app/list'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No item with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {

    // Connect to the socket room.
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'c3');
    }

    try {
      let apps = await Application.find().populateAll();
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(apps);
      }
      else {
        // Display the welcome view.
        let allApps = [];
        for (let i in apps) {
          let app = apps[i];
          let stack = await ServiceStack.findOne({id: app.stack.id}).populateAll();
          let stacklets = [];
          for (let j in stack.stacklets) {
            let stacklet = stack.stacklets[j];
            let nstacklet = await Stacklet.findOne({id: stacklet.id}).populateAll();
            stacklets.push(nstacklet);
          }
          stack.stacklets = stacklets;
          app.stack = stack;
          allApps.push(app);
        }
        return exits.success({apps: allApps});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

