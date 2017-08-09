/**
 * ApplicationStack.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


var Promise = require('bluebird');

module.exports = {

  attributes: {
    name: {type: 'String'},
    // This creates a stack implementation for each environment, A map would be good to use here.
    stacklets: {collection: 'ApplicationStacklet', via: 'stack'},
    services: {collection: 'Service'},
    applications: {type: 'Array'},
    toYAML: function () {
      return "YAML me";
    },
    fromYAML: function () {
      return "YAMLED"
    },
    /* this is used to create the UHC.yml file
     name: "MyApplicationStack",
     id: 12325,
     environments:
     local:
     services:
     - redis:

     dev:
     test:
     prod:
     */
    toJSON: function () {
      var me = this;
      return ApplicationStack.findOne(this.id).populateAll()
        .then(function (stack) {
          me = stack;
          var environments = {};
          var services = {};
          return Promise.map(stack.stacklets, function (stacklet) {
            return ApplicationStacklet.findOne(stacklet.id).populateAll()
              .then(function (fstacklet) {
                environments[fstacklet.env.name] = fstacklet;
                return fstacklet;
              })
          })
            .then(function (all) {
              return Promise.each(stack.services, function (service) {
                return Service.findOne(service.id).populateAll()
                  .then(function (fservice) {
                    services[fservice.name] = fservice;
                    return fservice;
                  })
              })
            })
            .then(function (all) {
              return {
                name: me.name,
                id: me.id,
                environments: environments,
                services: services
              }
            })
        })
    },
    fromJSON: function (json) {

    },
  }
};

