var request = require('supertest');
var spawn = require('child_process').spawn;

describe('caade-init Tests', function () {
  describe('inital caade setup', function () {
    it('should return a caade setup', function (done) {
      var command = spawn('dir');
      command.stdout.on('data', function(data) {
        console.log(data);
      });
      /*var command = spawn('./bin/caade', ['init']);
      command.on('close', function(code) {
        console.log(code)
        done(code);
      });*/
    });
  });
});
