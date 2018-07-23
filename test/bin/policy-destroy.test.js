const exec = require('child_process').exec;
const taction = require('../../api/controllers/policy/destroy');

describe('policy destroy Script Test Cases', function () {
  describe('Primary policy destroy Test Case', function () {
    it('Primary policy destroy Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bash -c bin/c3-policy-destroy ";
      let params = [];
      for(let key in taction.inputs) {
        if(key != "mode") {
          params.push("--" + key + " " + taction.inputs[key].type);
        }
      }
 command += params.join(" ");
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
