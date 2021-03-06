#!/usr/bin/env node



const program = require('commander');
const Client = require('node-rest-client').Client;
const config = require('../config');
/* Replace this with your own config file. */


let client = new Client();

// BEGIN: Dynamic Mapping based on Controller Action
const action = require('../../api/controllers/hardware/populate');
program.description(action.description);
program.option('-f, --filename <filename>', 'Create hardware based on yaml file');
program.option('-c, --cloud <string>', 'Name of the cloud to populate the hardware');
program.parse(process.argv);

let url = config.Url + '/hardware/populate?mode=json&';
url += 'cloud=' + program.cloud;
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
    console.log('Hardware Loaded into the Data Center:');
    for (let i in data) {
      console.log(data[i].name, data[i].type);
    }
  }
});
