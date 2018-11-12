module.exports = {

  friendlyName: 'resource get',

  description: 'Add description',

  inputs: {
    id: {
      description: 'The ID of the resource to look up.',
      type: 'number',
      required: true
    },
    ids: {
      description: 'The IDs of the resource to look up.',
      type: 'number',
      required: true
    },
    deep: {
      description: 'Follow links deep to the hierarchy',
      type: 'boolean',
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
      viewTemplatePath: 'resource/get'
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
      let retval = [];
      if(inputs.id) {
        let resource = await Resource.findOne({id:inputs.id}).populateAll();
        retval.push(resource);
      }
      if(inputs.ids) {
        let ids = inputs.ids.split(/,/);
        let resources = await Resource.find({id:ids}).populateAll();
        for(let i in resources) {
          let resource = resources[i];
          retval.push(resource);
        }
      }
      if (retavl.length === 0) {
        return exits.notFound('/notFound');
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json({resources: retval});
      }
      else {
        // Display the welcome view.
        return exits.success({resources: retval});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};
