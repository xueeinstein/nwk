// nwk install <pkg> -nw=<nw.js version>
// or
// in a directory with package.json, just run
// nwk install -nw=<nw.js version>
var install = module.exports;

var npm = require("npm"),
    path = require("path"),
    nwk = require("./nwk.js"),
    nodedir = require("./nodedir.js"),
    config = require("../config.js"),
    phonyConf = require("./config/phonyConf.js"),
    errorHandler = require("./utils/error-handler.js");

install.install = function (args, cb) {
  if (args.argv.remain.length > 0) {
    install.singlePkg(args, cb);
  } else {
    install.manyPkgs(args, cb);
  }
}

install.singlePkg = function (args, cb) {
  var pkg = args.argv.remain[0],
      nwVersion = args.nw,
      arg = args.argv.remain;
  install.checkInstallType(pkg, function (er, type) {
    if (er) return cb(er);
    if (type === "PUREJS") {
      npm.commands.install(arg, function (er, res) {
        if (er) return cb(er);
        console.log(res);
        return cb(null, "ok");
      });
    } else if (type === "ADDONS_I") {
      // cache corresponding nw node headers
      nodedir.cache(nwVersion, function (er) {
        if (er) return cb(er);
        args.nodedir = path.resolve(config.cacheDir, nwVersion);
        npm.load(args, function (er) {
          if (er) return cb(er);
          npm.commands.install(arg, function (er, res) {
            if (er) return cb(er);
            return cb(null, "ok");
          });
        });
      });
    } else if (type === "ADDONS_II") {
      nodedir.cache(nwVersion, function (er) {
        if (er) return cb(er);
        args.nodedir = path.resolve(config.cacheDir, nwVersion);
        args["build-from-source"] = true;
        npm.load(args, function (er) {
          if (er) return cb(er);
          npm.commands.install(arg, function (er, res) {
            if (er) return cb(er);
            return cb(null, "ok");
          });
        });
      });
    }
  });
}
// Here, installation has three different types:
// 1. install pure js node.js package ("PUREJS")
// 2. install node.js native module which uses node-gyp to build ("ADDONS_I")
// 3. install node.js native module which uses node-pre-gyp to build ("ADDONS_II")
// Generally, type 3 is the most complicate state, because the tool
// node-pre-gyp is designed too complicate and even some bugs in locating
// native module binary file
install.checkInstallType = function (pkg, cb) {
  // generate phony conf
  var item = "scripts.install",
      conf = phonyConf.view(pkg, item);
  npm.load(conf, function (er) {
    if (er) return errorHandler(er);
    npm.commands.view([pkg, item], function(er, data){
      if (er) return cb(er, null);
      if (Object.keys(data).length) {
        var ver = Object.keys(data).shift(),
            res = data[ver][item];
        if (res.indexOf("node-gyp") !== -1) {
          return cb(null, "ADDONS_I");
        } else if (res.indexOf("node-pre-gyp") !== -1) {
          return cb(null, "ADDONS_II");
        }
      } else {
        return cb(null, "PUREJS");
      }
    });
  });
}

