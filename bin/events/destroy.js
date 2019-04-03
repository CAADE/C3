#!/usr/bin/env node

var fs = require('fs');
var YAML = require('yamljs');

const program = require('commander');
const Client = require('node-rest-client').Client;
const config = require('../config');
/* Replace this with your own config file. */
const _ = require('lodash');

let client = new Client();

// BEGIN: Dynamic Mapping based on Controller Action
const action = require('../../api/controllers/events/destroy');
program.description(action.description);
for (key in action.inputs) {
  if (key !== 'mode') { // Used to force json output instead of html
    program.option('-' + key[0] + ', --' + key + ' <' + action.inputs[key].type + '>', action.inputs[key].description);
  }
}


program.parse(process.argv);

let url = config.Url + '/events/destroy?';
url += '&mode=json';

for (key in action.inputs) {
  if (program[key]) {
    url += '&' + key + '=' + program[key];
  }
}
// END: Dynamic Mapping based on Controller Action

client.get(url, (data, response) => {
  // parsed response body as js object
  if (data.problems) {
    console.error('Error:' + data.problems);
  }
  else {
    // Process the data returned.
    console.log('Events Destroyed:', data.name);
  }
});
