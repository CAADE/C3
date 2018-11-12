module.exports = {


  friendlyName: 'resource removeInstance',
  description: 'Remove Instance from Resource',

  inputs: {
    resource: {
      description: 'resource to remove the instance',
      type: 'ref',
      required: true,
    },
    instance: {
      description: 'instance to remove from the resource',
      type: 'ref',
      required: true,
    },
  },
  exits: {
    success: {
      outputFriendlyName: 'Resources',
      outputType: 'ref'
    },
  },


  fn: async function (inputs, exits) {

    let resource = inputs.resource;
    let instance = inputs.instance;

    await Resource.removeFromCollection(resource.id, 'instances', instance.id);
    resource = await Resource.update({id:resource.id}, {available: resource.available+1}).fetch();
    sails.sockets.broadcast('c3','resource', resource);

    return exits.success(resource);
  }
};
