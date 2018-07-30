const exec = require('child_process').exec;
const taction = require('../../controllers/request/destroy');

describe('request destroy Script Test Cases', () => {
  describe('Primary request destroy Test Case', () => {
    it('Primary request destroy Good Path', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bash -c bin/c3-request-destroy ";
      let params = [];
      _.each(Object.keys(taction.inputs), function (key) {
        if(key !== 'mode') {
          params.push('--' + key + ' ' + taction.inputs[key].type);
        }
      });
      command += params.join(' ');
      let results = exec(command, function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          done(err);
        }
        else {
          console.log(stdout);
        }
      });
      results.on('exit', function (code) {
        done(code);
      });
    });
  });
});
