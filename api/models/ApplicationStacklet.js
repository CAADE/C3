/**
 * ApplicationStacklet.js
 *
 * @description :: ApplicationStacklet is an ApplicationStacks for a specific environment.
 * It contains a collecton of ServiceLets. And has a relationship with environments.
 *
 *
 * @docs        ::
 */
var Promise = require('bluebird');

module.exports = {
  attributes: {
    name: {type: 'String'},
    env: {model: 'Environment'},
    stack: {model: 'ApplicationStack'},
    servicelets: {collection: 'Servicelet', via: 'stacklet'},

    loadDefinition: function (definition) {
      var me = this;
      return Promise.map(Object.keys(definition.services), function (name) {
        //Lookup ServiceTemplate by name and environment
        // If not found then thrown an exception
        var service = definition.services[name];
        return ServiceTemplate.find({name: service.template, env: me.env})
          .then(function (templates) {
            if (templates.length == 0) {
              throw new Error("ServiceTemplate " + service.template + " not found!");
            }
            else {
              return Servicelet.findOrCreate({name: name}, {
                name: name,
                stacklet: me,
                args: service.args,
                template: templates[0],
                args: service.args,
                expose: service.expose,
                linkNames: service.links
              })
                .then(function (servicelet) {
                  me.servicelets.add(servicelet.id);
                  return me.save().then(function () {
                    return servicelet;
                  });
                })
            }
          });
      })
        .then(function (servicelets) {
          return Promise.map(servicelets, function (servicelet) {
            return servicelet.resolveLinks();
          })
        })
        .then(function (servicelets) {
          me.servicelets.add(servicelets);
          return me.save().then(function () {
            return ApplicationStacklet.findOne(me.id).populateAll();
          })
        })
    }
  }
};

