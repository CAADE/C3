const fs = require('fs');
const program = require('commander');
require('../lib/subcommander');
const path = require('path');

const name = path.basename(__dirname);

program.version('0.0.1');
program.name(name);
files = fs.readdirSync(__dirname);
for (let i in files) {
  let file = files[i];
  if (file.includes('.js') && file !== 'index.js') {
    let cfile = file.replace('\.js','');
    const action = require(`../../api/controllers/${name}/${cfile}`);
    program.command(cfile + ' [options]', action.description);
  }
}

program.parse(process.argv);
