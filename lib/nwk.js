var nwk = module.exports;

var npm = require("npm"),
    nopt = require("nopt"),
    installer = require("./install.js"),
    nwapp = require("./nwapp.js"),
    config = require("../config.js"),
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
    nwk.nwkInstall(args, errorHandler);
  } else if (nwk.command === "get") {
    nwk.get(args, errorHandler);
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

nwk.nwkInstall = installer.install;

// nwk get [<version>] [--arch=<arch>] [--pl=<platform>]
nwk.get = function (args, cb) {
  var pl = args.pl | process.platform,
      arch = args.arch | process.arch;
  if (pl === "darwin") pl = "osx";
  else if (pl === "win32" || pl === "cygwin") pl = "win";
  console.log(args);
  console.log(pl, arch);
  if (typeof args.argv.remain[0] !== "undefined") {
    nwapp.get(args.argv.remain[0], pl, arch, function (er, res) {
      if (er) return cb(er);
      console.log(res);
      return;
    });
  } else {
    // default to get latest release version
    config.latestVer(function (er, latest){
      if (er) return cb(er);
      nwapp.get(latest, pl, arch, function (er, res) {
        if (er) return cb(er);
        console.log(res);
        return;
      });
    });
  }
}
