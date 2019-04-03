module.exports = {


  friendlyName: 'resource provision',
  description: 'Provision Resource',

  inputs: {
    resource: {
      description: 'Resource to provision',
      type: 'ref',
      required: true,
    },
    image: {
      description: 'Image to provision on the resources',
      type: 'ref',
      required: false,
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'resource',
      outputType: 'ref'
    },
  },


  fn: async function (inputs, exits) {

    console.log('Provision Resource', inputs);
    let resource = await Resource.update({id:inputs.resource.id}, {state: 'Provisioning'}).fetch();
    sails.sockets.broadcast('c3', 'resource', resource);
    // do something here.
    resource = await Resource.update({id:inputs.resource.id}, {state: 'Ready'}).fetch();
    sails.sockets.broadcast('c3', 'resource', resource);
    return exits.success(resource[0]);
  }
};
