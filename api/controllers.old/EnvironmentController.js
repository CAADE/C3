/**
 * EnvironmentController
 *
 * @description :: Server-side logic for managing Environments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * `EnvironmentController.create()`
   */
  create: function (req, res) {
    if (!req.query.name || req.query.name === 'undefined') {
      return res.json({error: 'Environment name is required!'});
    }
    return Environment.find({name: req.query.name})
      .then(function (envs) {
        if (envs.length > 0) {
          return res.json({error: 'Environment ' + req.query.name + ' is already created!'});
        }
        else {
          return Environment.create({name: req.query.name})
            .then(function () {
              return res.json({message: 'Environment ' + req.query.name + ' created!'});
            });
        }
      });
  },

  /**
   * `EnvironmentController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `EnvironmentController.delete()`
   */
  delete: function (req, res) {
    return res.json({
      todo: 'delete() is not implemented yet!'
    });
  },


  /**
   * `EnvironmentController.show()`
   */
  show: function (req, res) {
    if (!req.query.name) {
      return res.json({error: "Environment Name required!"});
    }
    return Environment.find({name: req.query.name})
      .then(function (envs) {
        if (envs.length > 0) {
          return res.json({environment: envs[0]});
        }
        else {
          return res.json({error: "Environment " + req.query.name + " not found!"});
        }
      });
  },


  /**
   * `EnvironmentController.ps()`
   */
  ps: function (req, res) {
    return res.json({
      todo: 'ps() is not implemented yet!'
    });
  },
  /**
   *
   */
  list: function (req, res) {
    return Environment.find()
      .then(function (envs) {
        return res.json({environments: envs});
      });
  }
};

