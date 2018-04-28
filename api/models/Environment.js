/**
 * Environment.js
 *
 * @description ::  Environment for applications to run in examples include. Dev, Test, Prod
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {type: 'String'},
    policies: { collection: 'Policy', via: 'env'},
    stacks: {type: 'Array'}
  }
};

