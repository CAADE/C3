const Client = require('node-rest-client').Client;
const taction = require('../../api/controllers/policy/list');
let client = new Client();

describe('Controller policy list Test Cases', () => {
  describe('Primary Controller policy list Test Case', () => {
    // Requires an environment and stack be list first.
    it('Primary Controller policy list Good Path', (done) => {
      let url = 'http://localhost:1337/policy/list?';
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
