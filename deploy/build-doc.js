const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const root = process.cwd();

// Build all of the puml files that have changed.


let cmd = "docker create madajaju/docker-sphinx";
console.error(">>>", cmd);
let cid = childProcess.execSync(cmd, {env: process.env, stdio: 'pipe', stderr: 'pipe'}).toString().replace(/(\r\n\t|\n|\r\t)/gm,"");;
cmd = "docker cp docs/. " + cid + ":/doc";
console.error(">>>", cmd);
childProcess.execSync(cmd, {env: process.env, stdio: 'inherit', stderr: 'inherit'});
cmd = "docker start -a " + cid;
console.error(">>>", cmd);
childProcess.execSync(cmd, {env: process.env, stdio: 'inherit', stderr: 'inherit'});

cmd = "docker rm " + cid;
console.error(">>>", cmd);
childProcess.execSync(cmd, {env: process.env, stdio: 'inherit', stderr: 'inherit'});

