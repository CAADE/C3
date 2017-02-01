var request = require('supertest');
var exec = require('child_process').exec;

describe('caade-init Tests', function () {
  describe('inital caade setup', function () {
    it('should return a caade setup', function (done) {
      var command = exec('bash', function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          done(err);
        }
        else {
          console.log(stdout);
          done();
        }
      });
    });
  });
});
