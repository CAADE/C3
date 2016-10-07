/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require("bluebird");

module.exports = {


  /**
   * `ServiceController.create()`
   */
  create: function (req, res) {
    if (!req.body.name) {
      return res.json({error: "Service name is missing!"})
    }
    if (!req.body.env) {
      return res.json({error: "Environment is missing!"})
    }
    // Create the service
    return Environment.find({name: req.body.env}).then(function (envs) {
      if (envs.length == 0) {
        return res.json({error: "Environment " + req.body.env + " not found!"});
      }
      else {
        return Service.findOrCreate({name: req.body.name}, {name: req.body.name})
          .then(function (service) {
            return ServiceTemplate.findOrCreate(
              {name: req.body.name, env: envs[0], service: service},
              {name: req.body.name, env: envs[0], service: service})
              .then(function (template) {
                template.loadDefinition(req.body.definition);
                return res.json({service: service});
              });
          });
      }
    });
  },

  /**
   * `ServiceController.list()`
   */
  list: function (req, res) {
    return Service.find().populateAll().then(function (services) {
      Promise.map(services, function (service) {
        service.envs = [];
        return Promise.each(service.templates, function (template) {
          return ServiceTemplate.findOne(template.id).populateAll().then(function (template) {
            service.envs.push(template.env.name);
          });
        })
      })
        .then(function (all) {
          return res.json({services: services});
        })
    });
  },

  /**
   * `ServiceController.remove()`
   */
  remove: function (req, res) {

    if (!req.query.name) {
      return res.json({error: "Name is missing!"});
    }
    return Service.destroy({name: req.query.name}).then(function () {
      return res.json({message: "Service " + req.query.name + " was removed!"});
    })
      .catch(function (e) {
        return res.json({error: "Could not find service " + req.query.name});
      })
  },


  /**
   * `ServiceController.show()`
   */
  show: function (req, res) {
    if (!req.query.name) {
      return res.json({error: "Name is missing!"});
    }
    Service.find({name: req.query.name}).then(function (services) {
      if (services.length == 0) {
        return res.json({error: "Could not find service " + req.query.name});
      }
      else {
        return res.json({service: services[0]});
      }
    })
  },


  /**
   * `ServiceController.addScript()`
   */
  addScript: function (req, res) {
    if (!req.body.name) {
      return res.json({error: "Name is missing!"});
    }
    if (!req.body.env) {
      return res.json({error: "Environment is missing!"});
    }
    return Service.find({name: req.body.name}).then(function (services) {
      if (services.length == 0) {
        return res.json({error: "Could not find service " + req.body.name});
      }
      else {
        return Environment.find({name: req.body.env}).then(function (envs) {
          if (envs.length == 0) {
            return res.json({error: "Environment " + req.body.env + " does not exist!"})
          }
          else {
            return ServiceTemplate.findOrCreate({name: req.body.name, service: services[0], env: envs[0]},
              {name: req.body.name, service: services[0], env: envs[0]})
              .then(function (template) {
                return RunScript.findOrCreate({event: req.body.event, owner: template}, {
                  event: req.body.event,
                  owner: template
                })
                  .then(function (script) {
                    script.script = req.body.script
                    script.parameters = req.body.parameters
                    return script.save().then(function () {
                      return res.json({service: services[0]});
                    })
                  })
              });
            return res.json({service: services[0]});
          }
        });
      }
    });
  },

  /**
   * `ServiceController.update()`
   */
  update: function (req, res) {
    if (!req.body.name) {
      return res.json({error: "Service name is missing!"})
    }
    if (!req.body.env) {
      return res.json({error: "Environment is missing!"})
    }
    // Create the service
    return Environment.find({name: req.body.env}).then(function (envs) {
      if (envs.length == 0) {
        return res.json({error: "Evnronment " + req.body.env + " not found!"});
      }
      else {
        return Service.findOrCreate({name: req.body.name}, {name: req.body.name})
          .then(function (service) {
            return ServiceTemplate.findOrCreate(
              {name: req.body.name, env: envs[0], service: service},
              {name: req.body.name, env: envs[0], service: service})
              .then(function (template) {
                template.loadDefinition(req.body.definition);
                return res.json({stack: service});
              });
          });
      }
    });
  }
};

