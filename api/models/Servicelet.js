/**
 * Servicelet.js
 *
 * @description :: This is an a Service for a specific Environment in the context of a ApplicationStacklet.
 * It is the combination of the ApplicationStacklet, Environment, and Service Definitions.
 * @docs        ::
 */

// var Promise = require('bluebird');

module.exports = {
  attributes: {
    name: {type: 'string'},
    args: {type: 'json'},
    template: {model: 'ServiceTemplate'},
    stacklet: {model: 'ApplicationStacklet'},
    expose: {type: 'Array'},
    linkNames: {type: 'Array'},
    links: {collection: 'Servicelet', via: 'dependents', dominant: true},
    dependents: {collection: 'Servicelet', via: 'links'},

    resolveLinks: function () {
      var me = this;
      if (me.linkNames) {
        return Promise.each(me.linkNames, function (linkName) {
          return Servicelet.find({stacklet: me.stacklet, name: linkName})
            .then(function (services) {
              if (services[0]) {
                me.links.add(services[0]);
                return me;
              }
              else {
                console.error("Could not find the service: ", linkName);
                return me;
              }
            });
        })
          .then(function () {
            return me.save().then(function () {
              return Servicelet.findOne(me.id).populateAll();
            });
          });
      }
      else {
        return me;
      }
    }
  }
};

