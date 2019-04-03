/**
 * Module dependencies.
 */

const spawn = require('child_process').spawn;
const path = require('path');
const dirname = path.dirname;
const basename = path.basename;
const fs = require('fs');
const commander = require('commander');

commander.executeSubCommand = function (argv, args, unknown) {
  args = args.concat(unknown);

  if (!args.length) {
    this.help();
  }
  if (args[0] === 'help' && args.length === 1) {
    this.help();
  }

  // <cmd> --help
  if (args[0] === 'help') {
    args[0] = args[1];
    args[1] = '--help';
  }
  // executable
  let f = argv[1];
  // name of the subcommand, link `pm-install`
  let bin = basename(f, path.extname(f)) + '-' + args[0];

  // In case of globally installed, get the base dir where executable
  //  subcommand file should be located at
  let baseDir;


  let link = fs.lstatSync(f).isSymbolicLink() ? fs.readlinkSync(f) : f;

  // when symbolink is relative path
  if (link !== f && link.charAt(0) !== '/') {
    link = path.join(dirname(f), link);
  }
  baseDir = dirname(link);


  // prefer local `./<bin>` to bin in the $PATH
  let localBin = path.join(baseDir, bin);

  // whether bin file is a js script with explicit `.js` or `.ts` extension
  let isExplicitJS = false;
  let found = false;
  if (exists(localBin + '.js')) {
    bin = localBin + '.js';
    isExplicitJS = true;
    found = true;
  } else if (exists(localBin + '.ts')) {
    bin = localBin + '.ts';
    isExplicitJS = true;
    found = true;
  } else if (exists(localBin + 'index.js')) {
    bin = localBin + '/index.js';
    isExplicitJS = true;
    found = true;
  } else if (exists(localBin)) {
    bin = localBin;
    found = true;
  }
  if (!found) {
    localBin = path.join(baseDir, args[0]);
    if (exists(localBin + '.js')) {
      bin = localBin + '.js';
      isExplicitJS = true;
      found = true;
    } else if (exists(localBin + '.ts')) {
      bin = localBin + '.ts';
      isExplicitJS = true;
      found = true;
    } else if (exists(localBin + '/index.js')) {
      bin = localBin + '/index.js';
      isExplicitJS = true;
      found = true;
    } else if (exists(localBin)) {
      bin = localBin;
      found = true;
    }
  }

  args = args.slice(1);

  let proc;
  if (process.platform !== 'win32') {
    if (isExplicitJS) {
      args.unshift(bin);
      // add executable arguments to spawn
      args = (process.execArgv || []).concat(args);

      proc = spawn(process.argv[0], args, {stdio: 'inherit', customFds: [0, 1, 2]});
    } else {
      proc = spawn(bin, args, {stdio: 'inherit', customFds: [0, 1, 2]});
    }
  } else {
    args.unshift(bin);
    proc = spawn(process.execPath, args, {stdio: 'inherit'});
  }

  let signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      if (proc.killed === false && proc.exitCode === null) {
        proc.kill(signal);
      }
    });
  });
  proc.on('close', process.exit.bind(process));
  proc.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.error('error: %s(1) does not exist, try --help', bin);
    } else if (err.code === 'EACCES') {
      console.error('error: %s(1) not executable. try chmod or run with root', bin);
    }
    process.exit(1);
  });

  // Store the reference to the child process
  this.runningCommand = proc;
};

function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (e) {
    return false;
  }
}
