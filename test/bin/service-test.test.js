const exec = require('child_process').exec;
const taction = require('../../api/controllers/service/test');

describe('service test Script Test Cases', () => {
  describe('Primary service test Test Case', () => {
    it('Primary service test Good Path', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = 'bash -c bin/c3-service-test ';
      let params = [];
      for(let key in taction.inputs) {
        if (key !== 'mode') {
          params.push('--' + key + ' ' + taction.inputs[key].type);
        }
      }
      command += params.join(' ');
      let results = exec(command, (err, stdout, stderr) => {
        console.log(stderr);
        if (err) {
          return done(err);
        }
        else {
          console.log(stdout);
        }
      });
      results.on('exit', (code) => {
        return done(code);
      });
    });
  });
});
