#!/usr/bin/env node

const program = require('commander');
const Client = require('node-rest-client').Client;
const config = require('../config');
/* Replace this with your own config file. */

let client = new Client();

// BEGIN: Dynamic Mapping based on Controller Action
const action = require('../../api/controllers/cloud/update');
program.description(action.description);
for (let key in action.inputs) {
  if (key !== 'mode') { // Used to force json output instead of html
    program.option('-' + key[0] + ', --' + key + ' <' + action.inputs[key].type + '>', action.inputs[key].description);
  }
}


program.parse(process.argv);

var url = config.Url + '/cloud/update?';
url += '&mode=json';

for (key in action.inputs) {
  if (program[key]) {
    url += '&' + key + '=' + program[key];
  }
}
// END: Dynamic Mapping based on Controller Action

try {
  client.get(url, (data, response) => {
    // parsed response body as js object
    if (data.error) {
      console.error('Error:' + data.error);
    }
    else {
      // Process the data returned.
      console.log('Updated Cloud: ', data.name);
    }
  });
}
catch (e) {
  console.error('Error:', e);
}
