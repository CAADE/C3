/**
 * StackController
 *
 * @description :: Server-side logic for managing Stacks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {

  /**
   * `StackController.create()`
   * name - name of the stack
   * filename - defines the stack
   * env - create the stack in this environment.
   */
  create: function (req, res) {
    if (!req.body.name) {
      return res.json({error: 'Stack Name is required!'});
    }
    if (!req.body.env) {
      return res.json({error: 'Environment Name is required!'});
    }
    return Environment.find({name: req.body.env})
      .then(function (envs) {
        if (envs.length > 0) {
          return ApplicationStack.findOrCreate({name: req.body.name})
            .then(function (stack) {
              return [stack, ApplicationStacklet.findOrCreate({name: req.body.name, env: envs[0], stack: stack},
                {name: req.body.name, env: envs[0], stack: stack})]
            })
            .spread(function (stack, stacklet) {
              return [stack, stacklet.loadDefinition(req.body.definition)];
            })
            .spread(function (stack, stacklet) {
              stack.stacklets.add(stacklet.id);
              return stack.save().then(function () {
                return res.json({stack: stack});
              });
            })
        }
        else {
          return res.json({error: "Environment " + req.body.env + " does not exist!"});
        }
      });
  },

  /**
   * `StackController.ls()`
   */
  list: function (req, res) {
    return ApplicationStack.find().then(function (stacks) {
      var retval = []
      _.each(stacks, function (stack) {
        stack.envs = Object.keys(stack.stacklets);
        retval.push(stack)
      })
      return res.json({stacks: retval});
    })
  }
  ,

  /**
   * `StackController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  }
  ,


  /**
   * StackController.delete()
   * @param req
   * @param res
   * @returns {*}
   */
  delete: function (req, res) {
    if (!req.query.name) {
      return res.json({error: 'Stack Name is required!'});
    }
    return ApplicationStack.findOrCreate({name: req.query.name})
      .then(function (stacks) {
        if (stacks.length > 0) {
          if (req.query.envs) {
            _.each(req.query.envs.split(','), function (env) {
              if (stacks[0].stacklets.hasOwnProperty(env)) {
                delete stacks[0].stacklets[env];
                return res.json({message: "Application Stack " + stack.name + " Removed"});
              }
              else {
                return res.json({error: "Application Stack " + stack.name + " not found for environment " + env});
              }
            })
          }
          else {
            delete stacks[0];
            return res.json({message: "Application Stack " + stack.name + " Removed"});

          }
        }
        else {
          return res.json({error: "Stack not found!"});
        }
      });
  }
  ,

  /**
   * `StackController.show()`
   */
  show: function (req, res) {
    var query;
    if (!req.query.name) {
      return res.json({error: 'Stack Name is required!'});
    }
    else {
      query = {name: req.query.name};
    }
    /* if (req.query.version) {
     query['version'] = req.query.version;
     }
     */
    return ApplicationStack.find(query).then(function (stacks) {
      if (stacks.length > 0) {
        // TODO: fileter the environments from the results
        return res.json({stack: stacks[0]});
      }
      return res.json({error: "Could not find the stack " + req.query.name});
    });
  }
}
;

