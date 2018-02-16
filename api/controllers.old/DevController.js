/**
 * DevController
 *
 * @description :: Server-side logic for managing Devs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `DevController.up()`
   */
  up: function (req, res) {
    let env = [];  // Default
    let services = [];  // All services in the application if empty
    if (req.query.env) {
      env = req.query.env.split(/,/);
    }
    else {
      env.push("dev");
    }
    if (req.query.services) {
      services = req.query.services.split(/,/);
    }
    else {
      services.push("*");
    }
    return res.json({
      env: env,
      services: services
    });
  },
  update: function (req, res) {
    let env = [];  // Default
    let services = [];  // All services in the application if empty
    if (req.query.env) {
      env = req.query.env.split(/,/);
    }
    else {
      env.push("dev");
    }
    if (req.query.services) {
      services = req.query.services.split(/,/);
    }
    else {
      services.push("*");
    }
    return res.json({
      env: env,
      services: services
    });
  },
  run: function (req, res) {
    let env = [];  // Default
    let services = [];  // All services in the application if empty
    let command = "";
    if (req.query.env) {
      env = req.query.env.split(/,/);
    }
    else {
      env.push("dev");
    }
    if (req.query.services) {
      services = req.query.services.split(/,/);
    }
    else {
      services.push("*");
    }
    if (req.query.command) {
      command = req.query.command;
    }
    return res.json({
      env: env,
      services: services,
      command: command
    });
  },
  ps: function (req, res) {
    return res.json({
      todo: 'ps() is not implemented yet!'
    });
  },
  kill: function (req, res) {
    if (!req.query.app) {
      res.json({error: "Application has not be defined!"});
    }
    return Application.find({name: req.query.app})
      .then(function (apps) {
        return res.json({message: "Kill Application", app: apps[0]});
      });
  },
  logs: function (req, res) {
    let env = [];  // Default
    let services = [];  // All services in the application if empty
    if (req.query.env) {
      env = req.query.env.split(/,/);
    }
    else {
      env.push("dev");
    }
    if (req.query.services) {
      services = req.query.services.split(/,/);
    }
    else {
      services.push("*");
    }
    if (!req.query.app) {
      return res.json({error: "Application has not be defined!"});
    }
    return Application.find({name: req.query.app})
      .then(function (apps) {
        return res.json({
          app: apps[0],
          env: env,
          services: services
        });
      });
  },
  deploy: function (req, res) {
    let env = [];  // Default
    if (req.query.env) {
      env = req.query.env.split(/,/);
    }
    else {
      env.push("production");
    }
    return res.json({
      env: env
    });
  }
};

