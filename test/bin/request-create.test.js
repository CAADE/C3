const exec = require('child_process').exec;
const taction = require('../../controllers/request/create');

describe('request create Script Test Cases', () => {
  describe('Primary request create Test Case', () => {
    it('Primary request create Good Path', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bash -c bin/c3-request-create ";
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