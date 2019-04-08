#!/usr/bin/env node



const program = require('commander');
const Client = require('node-rest-client').Client;
const config = require('../config');
/* Replace this with your own config file. */


let client = new Client();

// BEGIN: Dynamic Mapping based on Controller Action
const action = require('../../api/controllers/policy/create');

program.description(action.description);
program.option('-f, --filename <filename>', 'Create hardware into the data center');
for (key in action.inputs) {
  if (key !== 'mode') { // Used to force json output instead of html
    program.option('-' + key[0] + ', --' + key + ' <' + action.inputs[key].type + '>', action.inputs[key].description);
  }
}


program.parse(process.argv);

let url = config.Url + '/policy/create?';
url += 'name=' + program.name;
if (program.cloud) {
  url += '&cloud=' + program.cloud;
}
if (program.env) {
  url += '&env=' + program.env;
}
if (program.app) {
  url += '&app=' + program.app;
}
if (program.stack) {
  url += '&stack=' + program.stack;
}
url += '&mode=json';

var args = {headers: {'Content-Type': 'application/json'}, data: {}};

if (program.filename) {
  args.data = YAML.load(program.filename);
}
console.log(url);

client.post(url, args, (data, response) => {
  // parsed response body as js object
  if (data.error) {
    console.error(data.error, response);
  }
  else {
    console.log('Policy loaded into the datacenter: ', data.name);
  }
});

