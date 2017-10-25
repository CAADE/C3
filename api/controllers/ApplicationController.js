/**
 * ApplicationController
 *
 * @description :: Server-side logic for managing Applications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// var Promise = require('bluebird');

module.exports = {

  /**
   * `ApplicationController.create()`
   Create Application from an Application Stack
   name: String - Name of the application
   stack: String - Name of the application Stack
   returns: YAML with Name and Application Stack definitions.
   */
  create: function (req, res) {
    var name = "";  // Default
    var stackName = "";  // Default
    if (req.query.name) {
      name = req.query.name;
    }
    else {
      // Return Error "No Application Name specified"
      return res.json({error: "No Application Name specified!"})
    }
    if (req.query.stack) {
      stackName = req.query.stack;
    }
    else {
      // Return error with "No Application Stack specified"
      return res.json({error: "No Application Stack specified!"})
    }
    return Application.find({name: name})
      .then(function (apps) {
        if (apps.length > 0) {
          return res.json({error: "Application " + name + " already exists!"})
        }
        else {
          return ApplicationStack.find({name: stackName})
            .then(function (stacks) {
              if (stacks.length == 0) {
                return res.json({error: "Application Stack " + stackName + " does not exist!"})
              }
              else {
                return Application.create({name: name, stack: stacks[0], version: "0.0.1"})
                  .then(function (application) {
                    return application.toJSON()
                  })
                  .then(function (json) {
                    return res.json(json);
                  })
              }
            })
        }
      });
  },
  get: function (req, res) {
    var name = "";  // Default
    if (req.query.name) {
      name = req.query.name;
    }
    else {
      // Return Error "No Application Name specified"
      return res.json({error: "No Application Name specified!"})
    }
    return Application.find({name: name})
      .then(function (apps) {
        if (apps.length > 0) {
          return res.json({application: apps[0]})
        }
        else {
          return res.json({error: "Application " + name + " does not exist!"})
        }
      });
  },
  /**
   * `ApplicationController.delete()`
   */
  delete: function (req, res) {
    var name = "";  // Default
    if (req.query.name) {
      name = req.query.name;
    }
    else {
      // Return Error "No Application Name specified"
      name = "No Name";
    }
    return res.json({
      name: name,
    });
  },

  /**
   * `ApplicationController.list()`
   */
  list: function (req, res) {
    Application.find()
      .then(function (apps) {
        var retval = []
        return Promise.map(apps, function (app) {
          return app.toJSON();
        })
      })
      .then(function (apps) {
        return res.json({apps: apps});
      })
  },

  /**
   * `ApplicationController.show()`
   */
  show: function (req, res) {
    return res.json({
      todo: 'show() is not implemented yet!'
    });
  },
  /**
   * `ApplicationController.ps()`
   */
  ps: function (req, res) {
    if (!req.query.app) {
      return res.json({error: "Application not specified! You must be in the Application Directory!"});
    }
    var retval = [];
    return Application.find({name: req.query.app}).populate('instances')
      .then(function (apps) {
        if (apps.length > 0) {
          return Promise.each(apps[0].instances, function (instance) {
            return ApplicationInstance.findOne(instance.id).populateAll()
              .then(function (linst) {
                return Promise.each(linst.services, function(service) {
                  return ServiceInstance.findOne(service.id).populateAll().then(function(lservice) {
                    lservice.application = linst;
                    lservice.name = lservice.servicelet.name;
                    retval.push(lservice);
                    return lservice;
                  });
                });
              });
          });
        }
        else {
          return [];
        }
      })
      .then(function (ninstances) {
        return res.json(retval);
      });
  },
  /**
   * `ApplicationController.up()`
   */
  up: function (req, res) {
    var env = [];  // Default
    var services = [];  // All services in the application if empty
    if (!req.query.app) {
      return res.json({error: "Application not defined! Are you in the application directory?"});
    }
    if (req.query.env) {
      env = req.query.env.split(/,/);
    }
    else {
      env.push("Local");
    }
    if (req.query.services) {
      services = req.query.services.split(/,/);
    }
    else {
      services.push("*");
    }
    return Application.find({name: req.query.app})
      .then(function (apps) {
        if (apps.length > 0) {
          return Environment.find({name: env})
            .then(function (envs) {
              if (apps.length > 0) {
                // Actually call up on the application here.
                return apps[0].up(envs, services)
                  .then(function (appInstances) {
                    return res.json({message: "Application Running", instances: appInstances});
                  })
              }
              else {
                return res.json({error: "Environment could not be found!" + env});
              }
            })
        }
        else {
          return res.json({error: "Application " + req.query.app + " not found!"});
        }
      });
  },
  /**
   * Kill the services in the application
   * @param req
   * @param res
   * @returns {*}
   */
  kill: function (req, res) {
    var env = [];
    var services = [];
    var signal = "";
    if (!req.query.app) {
      res.json({error: "Application has not be defined!"});
    }
    if (req.query.env) {
      env = req.query.env.split(/,/);
    }
    else {
      env.push("Local");
    }
    if (req.query.services) {
      services = req.query.services.split(/,/);
    }
    if (!req.query.signal) {
      signal = "9";
    }
    return Application.find({name: req.query.app})
      .then(function (apps) {
        if (apps.length > 0) {
          return Environment.find({name: env})
            .then(function (envs) {
              if (apps.length > 0) {
                // Actually call up on the application here.
                return apps[0].kill(envs, services, signal)
                  .then(function (appInstances) {
                    return res.json({message: "Application Running", instances: appInstances});
                  })
              }
              else {
                return res.json({error: "Environment could not be found!" + env});
              }
            })
        }
        else {
          return res.json({error: "Application " + req.query.app + " not found!"});
        }
      });
  },
};

