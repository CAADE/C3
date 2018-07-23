const Client = require('node-rest-client').Client;
const taction = require('../../api/controllers/app/destroy');
let client = new Client();

describe('Controller app destroy Test Cases', () => {
  describe('Primary Controller app destroy Test Case', () => {
    // Requires an environment and stack be destroy first.
    it('Primary Controller app destroy Good Path', (done) => {
      let url = 'http://localhost:1337/app/destroy?';
      let params = [];
      for (let key in taction.inputs) {
        if (key !== 'mode') {
          params.push(key + '=' + taction.inputs[key].type);
        }
        else {
          params.push('mode=json');
        }
      }
      url += params.join('&');
      console.log(url);
      client.get(url, (data, response) => {
        if (response.statusCode !== 200) {
          console.error(response.statusMessage);
          console.error(response.headers['x-exit-description']);
          return done(response.statusMessage);
        }
        else {
          console.log(data);
          return done();
        }
      });
    });
  });
});
