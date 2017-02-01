var Promise = require('bluebird');

module.exports = {

  provisionApplication: function (resources, appInstance) {
    return Promise.map(appInstance.services, function (service) {
      service.state = "Running";
      service.save().then(function () {
        return service;
      });
    })
  }
};
