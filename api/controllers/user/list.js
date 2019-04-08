
module.exports = {

  friendlyName: 'user list',

  description: 'List Users',

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

  fn: async function (inputs, exits) {

    try {
      let user = await User.findOne(inputs.userId);
      if (!user) {return exits.notFound('/signup');}

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json({name: user.name});
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

