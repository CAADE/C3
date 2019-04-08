#!/usr/bin/env node



const program = require('commander');
const Client = require('node-rest-client').Client;
const config = require('../config');
/* Replace this with your own config file. */


let client = new Client();

// BEGIN: Dynamic Mapping based on Controller Action
const action = require('../../api/controllers/service/create');
program.description(action.description);
for (key in action.inputs) {
  if (key !== 'mode') { // Used to force json output instead of html
    program.option('-' + key[0] + ', --' + key + ' <' + action.inputs[key].type + '>', action.inputs[key].description);
  }
}


program.parse(process.argv);

var url = config.Url + '/service/create?';
url += '&mode=json';
for (key in action.inputs) {
  if (program[key]) {
    url += '&' + key + '=' + program[key];
  }
}
let args = {headers: {'Content-Type': 'application/json'}, data: {}};
if (program.filename) {
  args.data = YAML.load(program.filename);
}

client.post(url, args, (data, response) => {
  // parsed response body as js object
  if (data.error) {
    console.error('Error:' + data.error, response);
  }
  else if (data.problems) {
    console.error('Error:', data.problems);
  }
  else {
    console.log(data);
    // Process the data returned.
    console.log('Application Stack Created:', data.name);
  }
});

