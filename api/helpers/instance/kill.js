module.exports = {


  friendlyName: 'Kill Service Instance',


  description: 'Kill Service Instance',

  inputs: {
    instance: {
      description: 'Instance',
      type: 'ref',
      required: true
    },
    signal: {
      descirption: 'signal to kill service',
      type: 'number',
      required: false
    },
    reason: {
      descirption: 'reason the instance was killed',
      type: 'string',
      required: false
    }
  },

  exits: {
    notFound: {
      description: 'Instance has not be found!'
    }
  },

  fn: async function (inputs, exits) {
    let instance = inputs.instance;
    let signal = inputs.signal;
    let message = inputs.reason;

    if (!signal) {
      signal = 15;
    }

    if (typeof inputs.instance === 'string') {
      instance = await ServiceInstance.findOne({name: inputs.instance});
      if (!instance) {
        console.error('Instance not found:', inputs.instance);
        return exits.notFound(inputs);
      }
    }
    if (!message) {
      message = 'Stopped with signal:' + signal;
    }
    await ServiceInstance.update({id: instance.id}, {state: 'Stopping', message: message});
    instance = await ServiceInstance.find({id: instance.id}).populateAll();
    instance = instance[0];
    sails.sockets.broadcast('c3', 'sinstance', [instance]);
    // Free up the resources.
    let resIDs = [];
    for(let i in instance.resources) {
      resIDs.push(instance.resources[i].id);
      await sails.helpers.resource.removeInstance.with({resource:instance.resources[i], instance:instance});
    }
    await ServiceInstance.removeFromCollection(instance.id,'resources',resIDs);

    // mark the instance as stopped
    await ServiceInstance.update({id: instance.id}, {state: 'Stopped', message: message});
    instance = await ServiceInstance.find({id: instance.id}).populateAll();
    instance = instance[0];
    sails.sockets.broadcast('c3', 'sinstance', [instance]);

    return exits.success([instance]);
  }
};

