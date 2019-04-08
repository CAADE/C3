const exec = require('child_process').exec;
// const taction = require('../../api/controllers/events/set');

describe('events set Script Test Cases', () => {
  describe('Primary events set Test Case', () => {
    it('Primary events set Good Path', (done) => {
      let commands = [
        'bin/c3-events-set --name faults --value 100',
        'bin/c3-events-set --name accidents --value 1000',
        'bin/c3-events-set --name dwp --value 200',
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log('Command:', command);
        let stdout = exec(command);
        console.log('Output:', stdout.toString('utf8'));
      }
      return done();
    });
  });
});
