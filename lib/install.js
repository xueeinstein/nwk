// nwk install <pkg> --nw=<nw.js version>
// or
// in a directory with package.json, just run
// nwk install --nw=<nw.js version>
var install = module.exports;

var npm = require("npm"),
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    log = require("npmlog"),
    mkdirp = require("mkdirp"),
    nwk = require("./nwk.js"),
    nodedir = require("./nodedir.js"),
    config = require("../config.js"),
    nwapp = require("./nwapp.js"),
    async = require("async"),
    spawn = require("child_process").spawn,
    phonyConf = require("./config/phonyConf.js");

install.install = function (args, cb) {
  if (args.argv.remain.length > 0) {
    install.singlePkg(args, cb);
  } else {
    install.manyPkgs(args, cb);
  }
}

// Install single package
// TODO 1. check whether this pkg is pre-built by nwjs org
// If it is, directory download and unpack it!
// TODO 2. extra deps auto load, e.g. SDK requirement
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
        npm.load(args, function (er) {
          if (er) return cb(er);
          npm.config.set("nodedir", path.resolve(config.cacheDir, nwVersion));
          npm.commands.install(arg, function (er, res) {
            if (er) return cb(er);
            return cb(null, "ok");
          });
        });
      });
    } else if (type === "ADDONS_II") {
      nodedir.cache(nwVersion, function (er) {
        if (er) return cb(er);
        npm.load(args, function (er) {
          var userAgent = npm.config.list[0]["user-agent"];
          npm.config.set("build-from-source", true);
          npm.config.set("nodedir", path.resolve(config.cacheDir, nwVersion));
          npm.commands.install(arg, function (er, res) {
            if (er) return cb(er);
            return cb(null, "ok");
          });
        });
      });
    }
  });
}

install.manyPkgs = function (args, cb) {
  // TODO
  return cb(0, "Don't support install by reading package.json now..")
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
    if (er) return cb(er);
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

// because of node.js addons which using 'node-pre-gyp' to build
// has bugs when the addons is built for nw.js mainly it's binary
// file path error testBuild, help test this error, and provide
// instruction to correct binary file path error
var templates =
  ["index.html", "test.js", "package.json"]
   .map(function(f){
     if (f === "test.js") return path.resolve(config.cacheDir, "cache", "test.js");
     return path.resolve(__dirname, "../assets/templates/test-addons-build", f);
   });
install.testBuild = function (pkg, cb) {
  // detect nw.js exist in current directory
  var platforms = {
    "linux": "nw",
    "osx": "nwjs.app",
    "win": "nw.exe"
  }
  var pl = process.platform;
  if (pl === "darwin") pl = "osx";
  else if (pl === "win32" || pl === "cygwin") pl = "win";
  if (!fs.existsSync(platforms[pl])) {
    var er = new Error("cannot find nw.js in current directory");
    return cb(er);
  } else {
    if (!fs.existsSync("node_modules")) {
      var er = new Error("cannot find node_modules");
      return cb(er);
    } else {
      // test code in fellow format:
      //try {
      //  var m_1 = require(m);
      //  process.stdout.write([m, "loads success"].join(" ")+os.EOL)
      //} catch (e) {
      //  process.stderr.write([m, e.message].join("::"));
      //}
      var id = 0,
          testCode = "",
          modules = pkg? [pkg] : fs.readdirSync("node_modules"),
          syntax =
          ["// this code snippet is generated by program",
           "try {",
           "  var m%ID% = require('%MODULE%');",
           "  process.stdout.write(['loads', '%MODULE%', 'success'].join(' '))",
           "} catch(e) {",
           "  process.stdout.write(['%MODULE%', e.message].join('::'));",
           "}"].join(os.EOL);
      modules.forEach(function(m){
        if (m.indexOf(".") === 0 || m.indexOf("_") === 0) return;
        var replacements = {
          "%ID%": id.toString(),
          "%MODULE%": m
        }
        testCode += syntax.replace(/%\w+%/g, function(all){
          return replacements[all] || all;
        });
        testCode += os.EOL;
      });
      if (testCode.length === 0) {
        var er = Error("cannot find node modules under node_modules foler");
        return cb(er);
      } else {
        // generate nw app for test
        var testjs = path.resolve(config.cacheDir, "cache", "test.js");
        if (!fs.existsSync(testjs)) {
          mkdirp.sync(path.dirname(testjs));
        }
        fs.writeFile(testjs, testCode, function (er) {
          if (er) return cb(er);
          nwapp.generateNWapp(templates, function (er) {
            if (er) return cb(er);
            // fire nw app, and catch error
            platforms.osx = "nwjs.app/Contents/MacOS/nwjs";
            var nw = spawn("./"+platforms[pl]),
                addonsErr = "";
            nw.stdout.on("data", function (data) {
              var out = data.toString("ascii");
              if (out.indexOf("loads") === 0) {
                log.info(out)
              } else {
                addonsErr += out + os.EOL;
                log.error(out);
              }
           });
            nw.stderr.on("data", function (data) {
              var out = data.toString("ascii");
              //log.error("nw:"+out);
            });
            nw.on("close", function (code, singal) {
              log.info("got singal: "+singal)
              log.info("exist test");
            });
            setTimeout(function(){
              nw.kill("SIGHUP");
              handleAddonsErr(addonsErr, cb);
            }, 3000);
          });
        });
      }
    }
  }
}

// try to handle addons err
// currently, it only can auto handle binary file path error
function handleAddonsErr(er, cb) {
  if (er) {
    log.info("trying to handle errors");
    var errs = er.split(os.EOL).slice(0, -1);
    //console.log(errs);
    async.each(errs, function (e, cb_) {
      var module = e.split("::")[0],
          emsg = e.split("::")[1];
      if (emsg.indexOf("Cannot find module") === 0) {
        // it's binary file path error
        var emsgArr = emsg.split(" "),
            target = emsgArr[emsgArr.length - 1].slice(1, -1);
        //console.log(emsgArr);
        var p = path.join(target, "..", ".."),
            q = path.join(target, "..");
        var c = fs.readdirSync(p)[0]; // TODO, investigate whether only one folder under every situation
        fs.rename(path.join(p, c), q, cb_);
      } else {
        cb_(e);
      }
    }, function (er) {
      if (er) return cb(er);
      log.info("all node.js addons path error solved");
      nwapp.restoreNWapp(templates, cb);
    });
  }
}
