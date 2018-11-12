const exec = require('child_process').exec;
const taction = require('../../api/controllers/policy/create');

describe('policy create Script Test Cases', () => {
  describe('Primary policy create Test Case', () => {
    it('Primary Create Policy for Environment', (done) => {
      let commands = [
        'bin/c3-policy-create --filename assets/policy.yaml --name test-policy --env test'
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log('Command:', command);
        let stdout = exec(command);
        console.log('Output:', stdout.toString('utf8'));
      }
      return done();
    });
    it('Primary Create Policy for Cloud', (done) => {
      let commands = [
        'bin/c3-policy-create --filename assets/policy2.yaml --name dc1-policy --cloud dc1'
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log('Command:', command);
        let stdout = exec(command);
        console.log('Output:', stdout.toString('utf8'));
      }
      return done();
    });
    it('Primary Create Policy for App', (done) => {
      let commands = [
        'bin/c3-policy-create --filename assets/policy3.yaml --name app1-policy --app basicA'
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log('Command:', command);
        let stdout = exec(command);
        console.log('Output:', stdout.toString('utf8'));
      }
      return done();
    });
    it('Primary Create Policy for a Service', (done) => {
      let commands = [
        'bin/c3-policy-create --filename assets/policy4.yaml --name service1-policy --stack ingestion'
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
