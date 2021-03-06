/**
 * Service.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {type: 'string'},
    ports: {type: 'json'},
    parameters: {type: 'json'},
    config: {type: 'json'},
    replicas: {type: 'number'},
    state: {type: 'string', isIn: ['Running', 'Stopping', 'Stopped', 'Initializing', 'Error', 'Pause']},
    message: {type: 'string'},


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    servicelet: {model: 'Servicelet'},
    env: {model: 'Environment'},
    children: {collection: 'Service', via: 'parent'},
    instances: {collection: 'ServiceInstance', via: 'service'},
    apps: {collection: 'ApplicationInstance', via: 'services'},
    links: {collection: 'Service', via: 'dependant'},
    dependant: {model: 'Service'},
    parent: {model: 'Service'},
    requirements: {type: 'json'},
    app: {model: 'ApplicationInstance'},
    states: {collection: 'ServiceState', via: 'service'},
    currentState: {model: 'ServiceState'}
  },

};

