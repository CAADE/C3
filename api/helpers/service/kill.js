module.exports = {


  friendlyName: 'Kill all replicas of the Service',


  description: 'Kill all replicas of the Service',


  inputs: {
    service: {
      description: 'Service',
      type: 'ref',
      required: true
    },
    signal: {
      descirption: 'signal to kill service',
      type: 'number',
      required: false
    },
    reason: {
      descirption: 'reason the service was killed',
      type: 'string',
      required: false
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
    let signal = inputs.signal;
    let message = inputs.reason;

    if (!signal) {
      signal = 15;
    }

    if (typeof inputs.service === 'string') {
      parent = await Service.findOne({name: inputs.service}).populateAll();
      if (!parent) {
        console.error('Service not found:', inputs.service);
        return exits.notFound(inputs);
      }
    }
    if (!message) {
      message = 'Stopped with signal:' + signal;
    }
    await Service.update({id: parent.id}, {state: 'Stopping', message: message});
    parent = await Service.find({id:parent.id}).populateAll();
    parent = parent[0];
    // Kill all of the now replicas.
    // First kill the instances.
    let childMessage = message + '\n-> Stopped by ' + parent.name;
    for (let i in parent.instances) {
      let instance = parent.instances[i];
      await sails.helpers.instance.kill.with({instance: instance, signal: signal, reason: childMessage});
    }

    // Then kill all of the children Services
    for (let i in parent.children) {
      let child = parent.children[i];
      await sails.helpers.service.kill.with({service: child, signal: signal, reason: childMessage});
    }

    // When done mark the service as Stopped.
    await Service.update({id: parent.id}, { state: 'Stopped', signal: signal, message: message});
    parent = await Service.find({id:parent.id}).populateAll();
    parent = parent[0];
    sails.sockets.broadcast('c3', 'service', [parent]);

    return exits.success(parent);
  }
};

