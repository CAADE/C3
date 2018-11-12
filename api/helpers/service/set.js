module.exports = {


  friendlyName: 'Set replicas on Service',


  description: 'Set the number of replicas on a service',


  inputs: {
    service: {
      description: 'Service',
      type: 'ref',
      required: true
    },
    replicas: {
      description: 'Number of Replicas',
      type: 'number',
      required: true
    }
  },


  exits: {
    stackletNotFound: {
      description: 'Stacklet has not be found!'
    },
    notFound: {
      description: 'Service has not be found!'
    }
  },


  fn: async function (inputs, exits) {
    let parent = inputs.service;
    if (typeof inputs.service === 'string') {
      parent = await Service.findOne({name: inputs.service});
      if (!parent) {
        console.error('Service not found:', inputs.service);
        return exits.notFound(inputs);
      }
    }
    parent = await Service.findOne(parent.id).populateAll();

    // TODO: need to find the current number of running and then subtract for the new number.

    let servicelet = await Servicelet.findOne(parent.servicelet.id).populateAll();

    let stacklet = await Stacklet.findOne({stack: servicelet.stack.id, env: servicelet.env.id}).populateAll();
    if (!stacklet) {
      console.error('Stack ', servicelet.stack.name, ' for ', servicelet.env.name, ' environment not found!');
      await Service.update({id: parent.id}, {state: 'Error', message: 'Stacklet Not found!'});
      return exits.stackletNotFound(servicelet.stack.name);
    }

    // Oct 17, 2018
    // Changing the request to make sure I am requesting for an environment not wide open.
    // This requires request, reservation, resource and cloud to have env as an attribute.
    //
    // July 15, 2018
    // Should I get resources right now. Or map the resources at the highest level.
    // Pros: If I map them right now I can reuse this method to incrementally add instances
    // and the resources cooresponding to them.
    //
    // Cons: If I push this to the top then I only have to do the mapping or request to the cloud
    // broker once with the complete set of requests. This could mean I could optimize before I send the request.
    // This is find for the first request coming from launch but there would be no advantage during the subsquent
    // incremental change in service increments or decrements. For now leave it here to get the basic functionality
    // working

    ///////////////////////////////////////////////////////////////////////////////////
    // Now get the Resources required for the application and services.
    // Ask the cloud Broker for the resources.
    // The Resource request should have the ServiceInstance, and Resource Requirements in each request.
    // request = { instance: serviceInstance, requirements: [
    //    {type: 'compute', quantity: 1},
    //    {name: 'storage1', quantity: 100},
    //    {name: 'network1', quantity: 2},
    // ]};
    // Request has changed to be a request for each type of resource requested.
    // Requirements will still be a list but for one resource request.
    let requests = [];

    ///////////////////////////////////////////////////////////////////////////////////
    // Realize the Application and map Services to Application via config and environments.
    // If the stacklet has an image then we can start creating ServiceInstances from the image.
    // Only serviceInstances are created when there is an image.

    for (let i = 0; i < inputs.replicas; i++) {
      // If this has an image cooresponding to it then we create a serviceinstance.
      if (stacklet.image) {
        let instance = await ServiceInstance.create({
          name: parent.name + '-' + i,
          state: 'Initializing',
          service: parent.id,
          env: stacklet.env.id
        }).fetch();
        await sails.helpers.events.inc.with({events:"ServiceInstance", value:1});
        requests.push(await Request.create({
          state: 'Initializing',
          instance: instance.id,
          env: stacklet.env.id,
          requirements: [{type: 'compute', quantity: 1}]
        }).fetch());

        for (let mtype in stacklet.resources) {
          let rtype = stacklet.resources[mtype];
          for (let rname in rtype) {
            let resource = rtype[rname];
            requests.push(await Request.create({
              state: 'Initializing',
              instance: instance.id,
              env: stacklet.env.id,
              requirements: [{type: mtype, name: rname, quantity: resource}]
            }).fetch());
          }
        }
      }
      // Not iterate over the servicelets of the stacklet. Basiclaly get all of the children.
      for (let i in stacklet.servicelets) {
        // Create a service for each servicelet and attach it to the applicationInstance.
        let servicelet = stacklet.servicelets[i];
        let child = await Service.create({
          // inject parent service in here.
          parent: parent.id,
          name: parent.name + '-' + servicelet.name,
          config: inputs.config,
          servicelet: servicelet.id,
          state: 'Initializing',
          replicas: servicelet.replicas,
          env: servicelet.env.id
        }).fetch();
        // await Service.addToCollection(subService.id, 'parent', parent.id);
        await Service.addToCollection(parent.id, 'children', child.id);
        sails.sockets.broadcast('c3', 'service', [child]);
        await sails.helpers.service.set.with({service: child, replicas: servicelet.replicas});
      }
    }
    // TODO: Injection of Policies for the Application should happen here.
    // These policies should be attached to the request.

    // Save some time by sending the replicas together as one request to the cloud broker.
    let resources = await sails.helpers.broker.getResources.with({requests: requests});

    // Ok now provision the software from the requests that the resources are tied.
    let myRequests = await sails.helpers.engine.provision.with({requests:requests});
    await Service.update({id:parent.id}, {state:'Running'});
    service = await Service.find({id:parent.id}).populateAll();
    service = service[0];
    sails.sockets.broadcast('c3', 'service', [service]);

    return exits.success(service);
  }
};

