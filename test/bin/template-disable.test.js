const exec = require('child_process').exec;
const taction = require('../../api/controllers/template/disable');

describe('template disable Script Test Cases', function () {
  describe('Primary template disable Test Case', function () {
    it('Primary template disable Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bash -c bin/c3-template-disable ";
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
