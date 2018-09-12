const exec = require('child_process').execSync;
const taction = require('../../api/controllers/app/launch');

describe('app launch Script Test Cases', () => {
  describe('Primary app launch Test Case', () => {
    it('Primary Set up Cloud and Hardware', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let commands = [
        'bin/c3-cloud-create --name dc1 --type vmware',
        'bin/c3-cloud-create --name dc2 --type aws',
        'bin/c3-cloud-create --name dc3 --type openstack',
        'bin/c3-hardware-populate --cloud dc1 --filename assets/hardware.yaml',
        'bin/c3-hardware-populate --cloud dc2 --filename assets/hardware.yaml',
        'bin/c3-hardware-populate --cloud dc3 --filename assets/hardware.yaml',
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log("Command:", command);
        let stdout = exec(command);
        console.log("Output:", stdout.toString('utf8'));
      }
      return done();
    });
    it('Set up Service Stacks', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let commands = [
        'bin/c3-stack-create --name common --filename assets/common-service.yaml',
        'bin/c3-stack-create --name streaming --filename assets/streaming-service.yaml',
        'bin/c3-stack-create --name notification --filename assets/notification-service.yaml',
        'bin/c3-stack-create --name ingestion --filename assets/ingestion-service.yaml',
        'bin/c3-stack-create --name myApp --filename assets/app.yaml',
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log("Command:", command);
        let stdout = exec(command);
        console.log("Output:", stdout.toString('utf8'));
      }
      return done();
    });
    it('Set up Application', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let commands = [
        'bin/c3-app-create --name myApp --stack alert',
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log("Command:", command);
        let stdout = exec(command);
        console.log("Output:", stdout.toString('utf8'));
      }
      return done();
    });
    it('Launch Local Application', (done) => {
      let commands = [
        'bin/c3-app-launch --name myApp --env local'
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log("Command:", command);
        let stdout = exec(command);
        console.log("Output:", stdout.toString('utf8'));
      }
      return done();
    });
    it('Launch Test Application', (done) => {
      let commands = [
        'bin/c3-app-launch --name myApp --env test'
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log("Command:", command);
        let stdout = exec(command);
        console.log("Output:", stdout.toString('utf8'));
      }
      return done();
    });
     it('Launch Prod Application', (done) => {
      let commands = [
        'bin/c3-app-launch --name myApp --env prod'
      ];
      for (let i in commands) {
        let command = 'bash -c \"' + commands[i] + '\"';

        console.log("Command:", command);
        let stdout = exec(command);
        console.log("Output:", stdout.toString('utf8'));
      }
      return done();
    });

  });
});
