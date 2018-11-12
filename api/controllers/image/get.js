module.exports = {

  friendlyName: 'image get',

  description: 'Add description',

  inputs: {
    name: {
      description: 'Name of the Application',
      type: 'string',
      required: false
    },
    id: {
      description: 'ID of the Application',
      type: 'number',
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
      viewTemplatePath: 'image/get'
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
      let image;

      if (inputs.name) {
        image = await Image.findOne({name: inputs.name}).populateAll();
      }
      else if (inputs.id) {
        image = await Image.findOne({id: inputs.id}).populateAll();
      }
      if (!image) {
        return exits.notFound('/notFound');
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json({image:image});
      }
      else {
        // Display the welcome view.
        let stacklets = await Stacklet.find({image:image.id}).populateAll();
        return exits.success({image:image, stacklets: stacklets});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

