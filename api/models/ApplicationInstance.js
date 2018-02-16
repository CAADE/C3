/**
 * ApplicationInstance.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    app: {model: 'Application'},
    env: {model: 'Environment'},
    services: {collection: 'ServiceInstance', via: 'application'},
    state: {type: 'string'}
    // enum: ['Running', 'Stopped', 'Initializing', "Exit 0", "Exit 1", "Error"]
  }
};

