const taction = require('../../api/controllers/app/create');

describe('Controller app  Test Cases', () => {
  describe('Primary Controller app create Test Case', () => {
    // Requires an environment and stack be created first.
    it('Primary Controller app create Good Path', (done) => {
      let url = '/app/create?';
      let params = [];
      _.each(Object.keys(taction.inputs), (key) => {
        if (key !== 'mode') {
          params.push(key + '=' + taction.inputs[key].type);
        }
        else {
          params.push('mode=json');
        }
      });
      url += params.join('&');
      request(sails.hooks.http.app)
        .get(url)
        .expect('Content-Type', /json/)
        .end((errva, res) => {
          if (err) {
            return done(err);
          }
          else {
            console.log(res.body);
            return done();
          }
        });
    });
  });
});
