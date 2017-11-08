/**
 * CloudController
 *
 * @description :: Server-side logic for managing Clouds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * `CloudController.create()`
   */
  create: function (req, res) {
    if (!req.query.name) {
      res.send({error: "name is required"})
    }
    if (!req.query.type) {
      res.send({error: "type is required"})
    }
    return Cloud.findOrCreate({name: req.query.name}, {name: req.query.name, type: req.query.type})
      .then(function (cloud) {
        return res.json({name: cloud.name});
      });
  },


  /**
   * `CloudController.remove()`
   */
  remove: function (req, res) {
    if (!req.query.name) {
      res.send({error: "name is required"})
    }
    return Cloud.destroy({name: req.query.name})
      .then(function () {
        return res.json({name:req.query.name});
      });
  },


  /**
   * `CloudController.list()`
   */
  list: function (req, res) {
    return Cloud.find().then(function (clouds) {
      return res.json({clouds: clouds});
    })
  },


  /**
   * `CloudController.show()`
   */
  show: function (req, res) {
    if (!req.query.name) {
      return res.send({error: "name is required"})

    }
    return Cloud.find({name: req.query.name}).populateAll()
      .then(function (clouds) {
        return res.json(clouds[0]);
      });
  },


  /**
   * `CloudController.update()`
   */
  update: function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  }
};

