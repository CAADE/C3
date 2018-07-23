const exec = require('child_process').exec;
const taction = require('../../api/controllers/user/destroy');

describe('user destroy Script Test Cases', function () {
  describe('Primary user destroy Test Case', function () {
    it('Primary user destroy Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bash -c bin/c3-user-destroy ";
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
