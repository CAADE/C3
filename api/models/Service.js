/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name : { type: 'string' },
    version : { type: 'string' },
    ports: { type: 'Array'},
    expose: { type: 'Array'},
    parameters: { type: 'Array'},
    config: {type: 'string'},
    templates: {collection: 'ServiceTemplate', via:'service'}
  }
};

