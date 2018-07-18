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

  fn: async function (inputs, exits, env) {
    try {
      let dstack = this.req.body.service;
      let stack = await ServiceStack.findOrCreate({name: dstack.name, version: dstack.version}, {
        name: dstack.name,
        version: dstack.version
      });

      for (let name in dstack.environments) {
        let environ = dstack.environments[name];
        let environment = await Environment.findOrCreate({name: name}, {name: name});
        ////////////////////////////////////////
        // Resources for the Service that will be passed down to all of the
        let options = {
          name: dstack.name,
          env: environment.id,
          stack: stack.id
        };
        if(environ.hasOwnProperty('replicas')) { options.replicas = environ.replicas; }
        if(environ.hasOwnProperty('image')) { options.image = environ.image; }
        if(environ.hasOwnProperty('ports')) { options.ports = environ.ports; }
        if(environ.hasOwnProperty('config')) { options.config = environ.config; }
        if(environ.hasOwnProperty('resources')) { options.resources = environ.resources; }

        let stacklet = await Stacklet.findOrCreate({env: environment.id, stack: stack.id}, options );
        let servicelets = [];
        for (let sname in environ.services) {
          let dservice = environ.services[sname];
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
        }
        // Now add the links and dependent for the Servicelet
        for (let sname in environ.services) {
          let dservice = environ.services[sname];
          let serviceStack = await ServiceStack.findOne({name: dservice.type});
          let servicelet = await Servicelet.findOne({stack: serviceStack.id, env: environment.id, name: sname});
          let links = [];
          for (let i in dservice.links) {
            let link = dservice.links[i];
            let slink = await Servicelet.findOne({stack: serviceStack.id, env: environment.id, name: link});
            if (!slink) {
              console.error("Could not find:", link);
            }
            else {
              console.error("Found:", link);
              links.push(slink.id);
            }
          }
          if (links.length > 0) {
            await Servicelet.addToCollection(servicelet.id, 'links',  links);
          }
        }
      }
      console.log(dstack);
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

