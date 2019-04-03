module.exports = {


  friendlyName: 'resource removeInstance',
  description: 'Remove Instance from Resource',

  inputs: {
    name: {
      description: 'name of the resource to create',
      type: 'string',
      required: true,
    },
    hardware: {
      description: 'Hardware to create the resource',
      type: 'ref',
      required: true,
    },
    quantity: {
      description: 'quantity to create',
      type: 'number',
      required: false
    },
    env: {
      description: 'Environment to create the resource',
      type: 'ref',
      required: false
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'resource',
      outputType: 'ref'
    },
  },


  fn: async function (inputs, exits) {
    let hardware = await Hardware.findOne({id: inputs.hardware.id}).populateAll();
    if (!hardware) {
      return exits.notFound('Hardware not found!');
    }
    let env = await Environment.findOne({id: inputs.env.id});
    if(!env) {
      return exits.notFound('Environment not found!');
    }
    if(!inputs.quantity) {
      inputs.quantity = 1;
    }
    // Create the perfect size for the request. quantity is number of units requested.
    let opts = {
      name: inputs.name,
      hardware: hardware.id,
      cloud: hardware.cloud.id,
      env: env.id,
      available: inputs.quantity,
      capacity: inputs.quantity,
      type: hardware.type,
      disabled: false,
      state: 'Init'
    };

    let retval = await Resource.create(opts).fetch();
    hardware = await Hardware.update({id: hardware.id}, {
      available: hardware.available - inputs.quantity,
      reserved: hardware.reserved - inputs.quantity
    }).fetch();

    sails.sockets.broadcast('c3', 'resource', [retval]);
    sails.sockets.broadcast('c3', 'hardware', hardware);
    retval = await sails.helpers.resource.provision.with({resource:retval});

    return exits.success(retval);
  }
};
