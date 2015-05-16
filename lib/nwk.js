var nwk = module.exports;

var npm = require("npm"),
    log = require("npmlog"),
    nopt = require("nopt"),
    installer = require("./install.js"),
    nwapp = require("./nwapp.js"),
    config = require("../config.js"),
    npmErrorHandler = require("./utils/error-handler.js"),
    nwkErrorHandler = require("./nwkerr.js");

nwk.isValidated = function(args) {
  // here, I may filter out some commands
  // which is used in npm
  return true;
}
nwk.command = "help";
nwk.argv = null;
nwk.commands = function(args) {
  if (nwk.command === "install") {
    nwk.nwkInstall(args, npmErrorHandler);
  } else if (nwk.command === "get") {
    nwk.get(args, nwkErrorHandler);
  } else {
    npm.load(args, function (er) {
      debugger
      if (er) return npmErrorHandler(er);
      npm.commands[nwk.command](nwk.argv, function(er){
        if (nwk.command === "help") {
          return npmErrorHandler();
        }
        return npmErrorHandler(er); // npm default handler
      });
    });
  }
}

nwk.nwkInstall = installer.install;

// nwk get [<version>] [--arch=<arch>] [--platform=<platform>] [--unlink]
nwk.get = function (args, cb) {
  var pl = args.platform || process.platform,
      arch = args.arch || process.arch;

  if (args.unlink) nwapp.link = false;
  if (pl === "darwin") pl = "osx";
  else if (pl === "win32" || pl === "cygwin") pl = "win";
  if (typeof args.argv.remain[0] !== "undefined") {
    nwapp.get(args.argv.remain[0], pl, arch, function (er, res) {
      if (er) return cb(er);
      log.info(res);
      return cb(null, ["got nwjs-v", args.argv.remain[0], pl, arch].join("-"));
    });
  } else {
    // default to get latest release version
    config.latestVer(function (er, latest){
      if (er) return cb(er);
      nwapp.get(latest, pl, arch, function (er, res) {
        if (er) return cb(er);
        log.info(res);
        return cb(null, ["got nwjs-v", latest, pl, arch].join("-"));
      });
    });
  }
}
