var request = require('supertest');
var exec = require('child_process').exec;

describe('UHC-init Tests', function () {
  describe('inital UHC setup', function () {
    it('should return a UHC setup', function (done) {
      var command = exec('ls', {shell: 'bash'}, function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          done(err);
        }
        else {
          console.log(stdout);
        }
      });
      command.on('exit', function (code) {
        done(code);
      });
    });
  });
});
