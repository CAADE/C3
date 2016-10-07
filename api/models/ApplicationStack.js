/**
 * ApplicationStack.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {type: 'String'},
     // This creates a stack implementation for each environment, A map would be good to use here.
    stacklets: { collection: 'ApplicationStacklet', via: 'stack'},
    services: { collection: 'Service'},
    applications: {type: 'Array'},
    toYAML: function() {
      return "YAML me";
    },
    fromYAML: function() {
      return "YAMLED"
    }
  }
};

