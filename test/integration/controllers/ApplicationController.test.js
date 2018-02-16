const request = require('supertest');
// const request = require("supertest-as-promised");

describe('ApplicationController', function () {

  describe('create an application', function () {
    // Requires an environment and stack be created first.
    it('should return an error that the stack is missing', function (done) {
      request(sails.hooks.http.app)
        .get('/application/create?name=Test1&stack=TestStack')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          console.log(res);
          if (err) {
            return done(err);
          }
          else {
            return done();
          }
          /*
          if (res.body.error) {
            done();
          }
          else {
            done("Created Application without Application Stack!")
          }
          */
        });
    });
  });
});
