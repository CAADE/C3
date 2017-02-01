/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require('bluebird');

module.exports = {

  attributes: {
    name: {type: 'String'},
    stack: {model: 'ApplicationStack'},
    version: {type: 'String'},
    instances: {collection: 'ApplicationInstance'},

    toJSON: function () {
      return Application.findOne(this.id).populateAll()
        .then(function (app) {
          if (app.stack) {
            return app.stack.toJSON()
              .then(function (stack) {
                return {
                  application: {
                    name: app.name,
                    version: app.version,
                    author: "email@here.com",
                    description: "TBD"
                  },
                  stacklets: stack
                }
              });
          }
          else {
            return {
              application: {
                name: app.name,
                version: app.version,
                author: "email@here.com",
                description: "TBD"
              },
              stacklets: {}
            }
          }
        });
    },
    fromJSON: function (json) {
      return "YAMLED";
    },
    up: function (envs, services) {
      return Application.findOne(this.id).populateAll().then(function (me) {
        return Promise.each(envs, function (env) {
          return ApplicationOrchestratorService.up(me, env);
        });
      });
    },
    kill: function (envs, services, signal) {
      return Application.findOne(this.id).populateAll().then(function (me) {
        return Promise.each(envs, function (env) {
          var running = _.find(me.instances, function (instance) {
            return (instance.state == "Running" || instance.state == "Initializing") && instance.env == env.id;
          });
          if (running) {
            return ApplicationOrchestratorService.kill(me, running, services, signal);
          }
          else {
            return [];
          }
        });
      });
    }
  }
}

