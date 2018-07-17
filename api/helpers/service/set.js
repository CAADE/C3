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


  exits: {},


  fn: async function (inputs, exits) {
    let parent = inputs.service;
    if (typeof inputs.service === 'string') {
      parent = await Service.findOne({name: inputs.service});
      if (!parent) {
        console.error('Service not found:', inputs.service);
        return exits.notFound(service);
      }
    }
    parent = await Service.findOne(parent.id).populateAll();

    // TODO: need to find the current number of running and then subtract for the new number.

    let servicelet = await Servicelet.findOne(parent.servicelet.id).populateAll();

    let stacklet = await Stacklet.findOne({stack: servicelet.stack.id, env: servicelet.env.id}).populateAll();
    if (!stacklet) {
      console.error('Stack ', servicelet.stack.name, ' for ', servicelet.env.name, ' environment not found!');
      return exits.success();
    }


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
    //    {type: 'compute', quantity},
    //    {name: 'storage1', quantity: 100},
    //    {name: 'network1', quantity: 2},
    // ]};
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
          state: 'Initialized',
          service: parent.id
        }).fetch();
        let request = { instance: instance, requirements: [ {type: 'compute', qunatity: 1},]};
        for(let mtype in stacklet.resources) {
          let rtype = stacklet.resources[mtype];
          for(let rname in rtype) {
            let resource = rtype[rname];
            request.requirements.push({type:mtype, name: rname, quantity: resource});
          }
        }
        requests.push(request);
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
          replicas: servicelet.replicas
        }).fetch();
        // await Service.addToCollection(subService.id, 'parent', parent.id);
        await Service.addToCollection(parent.id, 'children', child.id);
        await sails.helpers.service.set.with({service: child, replicas: servicelet.replicas});
      }
    }
    // Injection of Policies for the Application should happen here.
    // These policies should be attached to the request.

    // Save some time by sending the replicas together as one request to the cloud broker.
    resources = await sails.helpers.broker.getResources.with({requests: requests});
    console.log('\nDone binding', parent.name);
    return exits.success();
  }
};

