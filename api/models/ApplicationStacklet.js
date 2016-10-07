/**
 * ApplicationStacklet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Promise = require('bluebird');

module.exports = {
  attributes: {
    name: {type: 'String'},
    env: {model: 'Environment'},
    stack: {model: 'ApplicationStack'},
    servicelets: {collection: 'Servicelet', via: 'stacklet'},

    loadDefinition: function(definition) {
      var me = this;
      return Promise.map(Object.keys(definition.services), function(name) {
        //Lookup ServiceTemplate by name and environment
        // If not found then thrown an exception
        var service = definition.services[name];
        return ServiceTemplate.find({name:service.template, env:me.env})
          .then(function(templates) {
            if(templates.length == 0) {
              throw new Error("ServiceTemplate " + servive.servicetemplate + " not found!");
            }
            else {
             return Servicelet.findOrCreate({name:name}, {
               name:name,
               stacklet:me,
               template:templates[0],
               args:service.args,
               expose:service.expose
             })
               .then(function(servicelet) {
                 return servicelet;
                 me.servicelets.add(servicelet.id);
                 return me.save().then(function() {
                   return me;
                 });
               })
            }
        });
      })
        .then(function(servicelets) {
          me.servicelets.add(servicelets);
          return me.save().then(function() {
            return this;
          })
        })
    }
  }
};

