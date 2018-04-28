const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const root = process.cwd();
compileBin(root);

function compileBin(folder) {
  console.log("NPM Build Recursive: " + folder);
  let files = getFiles(folder);
  for (let file of files) {
    processFile(file);
  }
  createBinaries(files);
}

function processFile(file) {
  console.log("Process File:", file);
}
function createBinaries(files) {
  var myMap = {}
  for (let file of files) {
    let items = file.split(/-/);
    let currentItem = myMap;
    for (let item of items) {
      if (!currentItem.hasOwnProperty(item)) {
        currentItem[item] = {};
      }
      currentItem = currentItem[item];
    }
  }
  let topMap = myMap[Object.keys(myMap)[0]]
  processMap(topMap, "");
  createFiles(myMap);
}

function createFiles(myMap) {
  for (let item of Object.keys(myMap)) {
    if(item.string) {
      // Write the file here
      let string = "programitem.string";
      fs.writeFileSync(file, item.string);
    }
  }
}
function processMap(myMap, name) {
  let newText = "";
  for (let command of Object.keys(myMap)) {
    // Find the description from the api/controller/file
    let description = "Default Description";
    let file = '../api/controllers/' + name + "/" + command + ".js";
    console.log(file);
    try {

      if (fs.statSync(file).isFile()) {
        console.log("found:", file);
        let action = require(file);
        description = action.description;
      }
    }
    catch(ex) { console.error("Not Found:", file); }
    newText += ".command('" + command + " [options]', '" + description + "')\n";
    processMap(myMap[command], command);
  }
  if (newText.length > 0) {
    myMap.string = newText;
  }
}

function getFiles(folder) {
  return fs.readdirSync(folder)
    .filter(file => fs.statSync(path.join(folder, file)).isFile())
    .map(file => file);
}
