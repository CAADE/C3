/**
 * ServiceTemplate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {type: 'string'},
    version: {type: 'string'},
    env: {model: 'Environment'},
    image: {model: 'Image'},
    service: {model: 'Service'},
    scripts: {collection: 'RunScript', via: 'owner'},
    parameters: {type: 'Array'},
    expose: {type: 'Array'},
    ports: {type: 'Array'},

    loadDefinition: function (definition) {
      if (definition) {
        this.expose = definition.expose;
        this.ports = definition.ports;
        this.parameters = definition.parameters;
        this.version = definition.version;
        this.save();
      }
      return this;
    }
  }
};

