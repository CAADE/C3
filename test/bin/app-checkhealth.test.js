const exec = require('child_process').exec;
const taction = require('../../api/controllers/app/checkhealth');

describe('app checkhealth Script Test Cases', () => {
  describe('Primary app checkhealth Test Case', () => {
    it('Primary app checkhealth Good Path', (done) => {
      let command = 'bin/c3-app-checkhealth ';
      let params = [];
      for(let key in taction.inputs) {
        if(key !== 'mode') {
          params.push('--' + key + ' ' + taction.inputs[key].type);
        }
      }
      command += params.join(' ');
      let results = exec("bash -c " + command,  (err, stdout, stderr) => {
        console.log(stderr);
        if (err) {
          done(err);
          return;
        }
        else {
          console.log(stdout);
        }
      });
      results.on('exit', (code) => {
        done(code);
      });
    });
  });
});
