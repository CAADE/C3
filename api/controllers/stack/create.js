module.exports = {

  friendlyName: 'stack create',
  description: 'Create Stack',
  inputs: {
    name: {
      description: 'Name of the stack',
      type: 'string',
      required: true
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
      let dstack = this.req.body.service;
      let stack = await ServiceStack.findOrCreate({name: dstack.name, version: dstack.version}, {
        name: dstack.name,
        version: dstack.version,
        parameters: dstack.parameters
      });

      for (let name in dstack.environments) {
        let dstacklet = dstack.environments[name];
        let environment = await Environment.findOrCreate({name: name}, {name: name});
        ////////////////////////////////////////
        // Resources for the Service that will be passed down to all of the
        let options = {
          name: dstack.name,
          env: environment.id,
          stack: stack.id
        };
        if (dstacklet.hasOwnProperty('replicas')) {
          options.replicas = dstacklet.replicas;
        }
        if (dstacklet.hasOwnProperty('image')) {
          options.image = dstacklet.image;
          // Find or create an image.
          let image = await Image.findOrCreate({name: dstacklet.image}, {name: dstacklet.image});
          options.image = image.id;
        }
        if (dstacklet.hasOwnProperty('ports')) {
          options.ports = dstacklet.ports;
        }
        if (dstacklet.hasOwnProperty('config')) {
          options.config = dstacklet.config;
        }
        if (dstacklet.hasOwnProperty('resources')) {
          options.resources = dstacklet.resources;
        }
        let stacklet = await Stacklet.findOrCreate({env: environment.id, stack: stack.id}, options);
        for (let sname in dstacklet.services) {
          let dservice = dstacklet.services[sname];
          ///////////////////////////
          // findOrCreate should be replacedd with find.
          // let serviceStack = await ServiceStack.find({name: dservice.type});
          // if(!serviceStack) {
          //   return exits.notFound('Service not found', dservice.type , 'for environment', name);
          // }
          let serviceStack = await ServiceStack.findOrCreate({name: dservice.type}, {name: dservice.type});
          ////////////////////////////////
          // findOrCreate should be replaced with find
          // let servicelet = await ServiceStack.find({stack: serviceStack.id, env: environment.id});
          let options = {
            name: sname,
            stack: serviceStack.id,
            env: environment.id,
            stacklet: stacklet.id
          };
          if (dservice.hasOwnProperty('replicas')) {
            options.replicas = dservice.replicas;
          }
          if (dservice.hasOwnProperty('resources')) {
            options.resources = dservice.resources;
          }
          if (dservice.hasOwnProperty('ports')) {
            options.ports = dservice.ports;
          }
          if (dservice.hasOwnProperty('args')) {
            options.args = dservice.args;
          }
          if (dservice.hasOwnProperty('config')) {
            options.config = dservice.config;
          }
          let servicelet = await Servicelet.findOrCreate({
            stack: serviceStack.id,
            env: environment.id,
            name: sname
          }, options);
          await Stacklet.addToCollection(stacklet.id, 'servicelets', servicelet.id);
        }
        // Now add the links and dependent for the Servicelet
        for (let sname in dstacklet.services) {
          let dservice = dstacklet.services[sname];
          let serviceStack = await ServiceStack.findOne({name: dservice.type});
          let servicelet = await Servicelet.findOne({stack: serviceStack.id, env: environment.id, name: sname});
          let links = [];
          for (let i in dservice.links) {
            let link = dservice.links[i];
            let slink = await Servicelet.findOne({stack: serviceStack.id, env: environment.id, name: link});
            if (!slink) {
              console.error('Could not find link to Servicelet:', environment.name, link);
            }
            else {
              links.push(slink.id);
            }
          }
          if (links.length > 0) {
            await Servicelet.addToCollection(servicelet.id, 'links', links);
          }
        }
      }
      if (inputs.mode === 'json') {
        return exits.json(stack);
      }
      else {
        return exits.success(stack);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

