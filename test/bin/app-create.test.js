const exec = require('child_process').exec;
const taction = require('../../api/controllers/app/create');

describe('app create Script Test Cases', () => {
  describe('Primary app create Test Case', () => {
    it('Primary app create Good Path', (done) => {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let commands = [
        'bin/c3-stack-create --name common --filename assets/common-service.yaml',
        'bin/c3-stack-create --name streaming --filename assets/streaming-service.yaml',
        'bin/c3-stack-create --name notification --filename assets/notification-service.yaml',
        'bin/c3-stack-create --name ingestion --filename assets/ingestion-service.yaml',
        'bin/c3-stack-create --name myApp --filename assets/app.yaml',
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
  });
});
