// var request = require('supertest');
const exec = require('child_process').exec;

describe('c3-init Tests', function () {
  describe('inital c3 setup', function () {
    it('should return a c3 setup', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = exec("ls -latr", function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          return done(err);
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
