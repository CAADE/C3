const exec = require('child_process').exec;
const taction = require('../../api/controllers/app/get');

describe('app get Script Test Cases', function () {
  describe('Primary app get Test Case', function () {
    it('Primary app get Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bash -c bin/c3-app-get ";
      let params = [];
      for (let key in taction.inputs) {
        if (key != "mode") {
          params.push("--" + key + " " + taction.inputs[key].type);
        }
      }
      command += params.join(" ");
      let results = exec(command, function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          return done(err);
        }
        else {
          console.log(stdout);
        }
      });
      results.on('exit', function (code) {
        return done(code);
      });
    });
  });
});
