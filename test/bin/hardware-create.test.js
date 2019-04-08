const exec = require('child_process').exec;
const taction = require('../../api/controllers/hardware/create');

describe('hardware create Script Test Cases', () => {
  describe('Primary hardware create Test Case', () => {
    it('Primary hardware create Good Path', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = 'bash -c bin/c3-hardware-create ';
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
