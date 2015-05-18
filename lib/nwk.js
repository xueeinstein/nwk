var nwk = module.exports;

var npm = require("npm"),
    os = require("os"),
    fs = require("fs"),
    path = require("path"),
    log = require("npmlog"),
    nopt = require("nopt"),
    colors = require("colors"),
    installer = require("./install.js"),
    nwapp = require("./nwapp.js"),
    config = require("../config.js"),
    npmErrorHandler = require("./utils/error-handler.js"),
    nwkErrorHandler = require("./nwkerr.js");

try {
  // startup, ok to do this synchronously
  var j = JSON.parse(fs.readFileSync(
    path.join(__dirname, "../package.json"))+"")
  nwk.version = j.version
} catch (ex) {
  try {
    log.info("error reading version", ex)
  } catch (er) {}
  nwk.version = ex
}

nwk.isValidated = function(args) {
  // here, I may filter out some commands
  // which is used in npm
  return true;
}
nwk.command = "help";
nwk.argv = null;
nwk.commands = function(args) {
  if (nwk.command === "help") {
    nwk.help();
  } else if (nwk.command === "install") {
    nwk.nwkInstall(args, npmErrorHandler);
  } else if (nwk.command === "get") {
    nwk.get(args, nwkErrorHandler);
  } else if (nwk.command === "test") {
    nwk.test(args, nwkErrorHandler);
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

nwk.help = function () {
  console.log("Usage: nwk <cmd>"+os.EOL);
  console.log("nwk get [--nw=<nw.js version>]".green);
  console.log("download nw.js into current directory, --nw is optional, default version is the latest release version");
  console.log("nwk install <module_name> --nw=<nw.js version>".green);
  console.log("install node modules for nw.js");
  console.log("nwk uninstall <module_name>".green);
  console.log("uninstall node modules");
  console.log("nwk test [<module_name>]".green);
  console.log("test installed node modules, and be able to auto-solve addons require path error");
}

nwk.nwkInstall = installer.install;

// nwk get [--nw=<version>] [--arch=<arch>] [--platform=<platform>] [--unlink]
nwk.get = function (args, cb) {
  var pl = args.platform || process.platform,
      arch = args.arch || process.arch;

  if (args.unlink) nwapp.link = false;
  if (pl === "darwin") pl = "osx";
  else if (pl === "win32" || pl === "cygwin") pl = "win";
  if (typeof args.nw !== "undefined") {
    nwapp.get(args.nw, pl, arch, function (er, res) {
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

nwk.test = function (args, cb) {
  if (typeof args.argv.remain[0] !== "undefined") {
    installer.testBuild(args.argv.remain[0], cb);
  } else {
    installer.testBuild(null, cb);
  }
}
