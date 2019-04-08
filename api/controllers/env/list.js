module.exports = {

  friendlyName: 'env list',

  description: 'Return a list of environments',

  inputs: {
    cloud: {
      description: 'cloud to find environments',
      type: 'string',
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
      viewTemplatePath: 'env/list'
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
      let items;
      if(inputs.cloud) {
        let cloud = await Cloud.find({id:inputs.cloud}).populateAll();
        if(cloud.length > 0) {
          items = cloud[0].envs;
          let ids =[];
          for(let j in items) {
            ids.push(items[j].id);
          }
          items = await Environment.find({id:ids}).populateAll();
        }
      }
      else {
        items = await Environment.find().populateAll();
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(items);
      }
      else {
        for(let i in items) {
          let resources = {};
          let apps = await ApplicationInstance.count({env:items[i].id});
          let services = await ServiceInstance.count({env:items[i].id});
          resources.compute = await Resource.count({env:items[i].id,type:'compute'});
          resources.storage = await Resource.count({env:items[i].id,type:'storage'});
          resources.network = await Resource.count({env:items[i].id,type:'network'});
          items[i].applications = apps;
          items[i].services = services;
          items[i].resources = resources;
        }
        // Display the welcome view.
        return exits.success({envs: items});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

