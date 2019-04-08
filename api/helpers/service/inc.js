module.exports = {
  friendlyName: 'Inc Service',
  description: 'Increment service',
  inputs: {
    service: {
      description: 'Service',
      type: 'ref',
      required: true
    },
    amount: {
      description: 'amount to increment the Service',
      type: 'number',
      required: false
    },
  },
  exits: {},

  fn: async function (inputs, exits) {
    console.log('Service Dec');
    try {
      let serv = inputs.service;
      if (typeof serv === 'string') {
        serv = await Service.findOne({name: serv}).populateAll();
        if (!serv) {
          console.error('Service increment not found:', inputs.service);
          return exits.serviceNotFound(serv);
        }
      }
      // Find the current running children or instances and then set the service
      let running = 0;
      for (let i in serv.instances) {
        let instance = serv.instances[i];
        if (instance.state === 'Running' || instance.state === 'Initializing' || instance.state === 'Deploying') {
          running++;
        }
      }
      for (let i in serv.children) {
        let child = serv.children[i];
        if (child.state === 'Running' || child.state === 'Initializing' || child.state === 'Deploying') {
          running++;
        }
      }
      let amount = running + inputs.amount;
      await sails.helpers.service.set.with({service: serv, replicas: amount});

      return exits.success(serv);
    }
    catch (e) {
      console.error(e);
      return exits.error(e);
    }
  }
};
