// const request = require('supertest');
const exec = require('child_process').exec;

describe('UHC-init Tests', function () {
  describe('inital UHC setup', function () {
    it('should return a UHC setup', function (done) {
      let command = exec('dir', function (err, stdout, stderr) {
        console.log(command);
        console.log(stderr);
        if (err) {
          return done(err);
        }
        else {
          console.log(stdout);
          return done();
        }
      });
    });
  });
});
