module.exports = {
  friendlyName: 'Dec Service',
  description: 'Decrement service',
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
          return exits.serviceNotFound(serv);
        }
      }
      for (let i = 0; i < inputs.amount && i.children.length; i++) {
        await sails.helpers.service.kill.with({service: serv.children[si], signal: 3, reason: 'Automatically Killed'});
      }

      for (let si = 0; si < inputs.amount && si < serv.instances.length; si++) {
        await sails.helpers.instance.kill.with({
          instance: serv.instances[si],
          signal: 3,
          reason: 'Automatically Killed'
        });
      }
      let amount = serv.replicas - inputs.amount;
      if (amount < 0) {
        amount = 0;
      }

      await Service.update({id: serv.id}, {replica: amount});
      serv = await Service.findOne(serv.id).populateAll();
      sails.sockets.broadcast('fleet', 'service', serv);
      return exits.success(serv);
    }
    catch (e) {
      console.error(e);
      return exits.error(e);
    }
  }
};

