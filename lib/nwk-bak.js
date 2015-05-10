module.exports = nwk;


var npm = require("npm");
var nopt = require("nopt");
var install = require("./install.js");

nwk.isValidated = function(args) {
  // here, I may filter out some command
  // which is used in npm
  return true;
}
nwk.command = "help";
nwk.argv = [];
nwk.commands = function(args) {
  npm.load(args, function (er) {
    if (er) return handlError(er)
    if (false) {
      // re-implement "npm install"
      nwk.nwkInstall(nwk.argv, function(er, data){
        if (er) {
          console.log("install failed");
          return;
        }
        console.log("get data");
        console.log(data);
      });
    } else {
      npm.commands[nwk.command](nwk.argv, function(er, data){
        //callback
      });
    }
  });
  return console.log("finished");
}

nwk.nwkInstall = install;
