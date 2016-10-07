var Promise = require('bluebird');

module.exports = {


  getResources: function(appInstance) {
    return Promise.map(appInstance.services, function(service) {
      return Resource.create({name:service.name})
    });
  }

};
