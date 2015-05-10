var nwk = module.exports;

var npm = require("npm"),
    nopt = require("nopt"),
    install = require("./install.js"),
    errorHandler = require("../lib/utils/error-handler.js");

nwk.isValidated = function(args) {
  // here, I may filter out some commands
  // which is used in npm
  return true;
}
nwk.command = "help";
nwk.argv = null;
nwk.commands = function(args) {
  if (nwk.command === "install") {
    nwk.nwkInstall(args);
  } else {
    npm.load(args, function (er) {
      debugger
      if (er) return errorHandler(er);
      npm.commands[nwk.command](nwk.argv, function(er){
        if (nwk.command === "help") {
          return errorHandler();
        }
        return errorHandler(er); // npm default handler
      });
    });
  }
}

nwk.nwkInstall = install;
