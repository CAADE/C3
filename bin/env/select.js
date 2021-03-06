#!/usr/bin/env node



const program = require('commander');
const Client = require('node-rest-client').Client;
const config = require('../config');
/* Replace this with your own config file. */


let client = new Client();

// BEGIN: Dynamic Mapping based on Controller Action
const action = require('../../api/controllers/env/select');
program.description(action.description);
for (key in action.inputs) {
  if (key !== 'mode') { // Used to force json output instead of html
    program.option('-' + key[0] + ', --' + key + ' <' + action.inputs[key].type + '>', action.inputs[key].description);
  }
}


program.parse(process.argv);

var url = config.Url + '/env/select?';
url += '&mode=json';

for (key in action.inputs) {
  if (program[key]) {
    url += '&' + key + '=' + program[key];
  }
}
// END: Dynamic Mapping based on Controller Action

client.get(url, (data, response) => {
  // parsed response body as js object
  if (data.error) {
    console.error('Error:' + data.error, response);
  }
  else {
    config.defaultEnv = data.name;
    let yamlString = YAML.stringify(config, 4);
    // Process the data returned.
    fs.writeFile('.c3.yaml', yamlString, (err) => {
      if (err) {
        return console.error(err);
      }
      // Need to set the default environment to the one selected.
      console.log('Environment Selected: ' + data.name);
    });
  }
});
