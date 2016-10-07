// var request = require('supertest');
var request = require("supertest-as-promised");

describe('ApplicationController', function () {

  describe('create an application', function () {
    // Requires an environment and stack be created first.
    it('should return an error that the stack is missing', function (done) {
      request(sails.hooks.http.app)
        .get('/application/create?name=Test1&stack=TestStack')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          if (res.body.error) {
            done();
          }
          else {
            done("Created Application withour Application Stack!")
          }
        })
    });
    // Create an environment, and application stack first
    it('should return an application', function (done) {
      // Requires an environment and stack be created first.
      request(sails.hooks.http.app)
        .get('/environment/create?name=Local')
        .expect('Content-Type', /json/)
        .then(function (res) {
          if(res.body.error) {
            done(res.body.error);
          }
          return request(sails.hooks.http.app)
            .get('/stack/create?name=TestStack&filename=testStack.yaml&env=Local')
            .expect('Content-Type', /json/);
        })
        .then(function (res) {
          if(res.body.error) {
            done(res.body.error);
          }
          return request(sails.hooks.http.app)
            .get('/application/create?name=Test1&stack=TestStack')
            .expect('Content-Type', /json/);
        })
        .then(function (res) {
          if (res.body.error) {
            done(res.body.error);
          }
          else {
            done();
          }
        })
    });
  });
});
