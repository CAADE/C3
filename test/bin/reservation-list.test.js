const exec = require('child_process').exec;
const taction = require('../../api/controllers/reservation/list');

describe('reservation list Script Test Cases', () => {
  describe('Primary reservation list Test Case', () => {
    it('Primary reservation list Good Path', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = 'bash -c bin/c3-reservation-list ';
      let params = [];
      _.each(Object.keys(taction.inputs), (key) => {
        if(key !== 'mode') {
          params.push('--' + key + ' ' + taction.inputs[key].type);
        }
      });
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
