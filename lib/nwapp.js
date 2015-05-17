// nwapp, help get and update nw.js
// also support nw.js node modules self test

var nwapp = module.exports;

var fs = require("fs"),
    path = require("path"),
    wget = require("wget"),
    rimraf = require("rimraf"),
    spawn = require("child_process").spawn,
    log = require("single-line-log").stdout,
    npmlog = require("npmlog");
    config = require("../config.js");

nwapp.link = true;

// get nw.js and unpack
// if nwapp.link is true, create symlink to current directory
// if nwapp.link is false, unpack all entry to current dir, no symlink
nwapp.get = function (nwVersion, pl, arch, cb) {
  // validate args
  if (["win", "linux", "osx"].indexOf(pl) === -1) {
    var er = new Error("Only support 'win', 'linux' or 'osx' as platform arg");
    return cb(er);
  }
  if (["ia32", "x64"].indexOf(arch) === -1) {
    var er = new Error("Only support 'ia32' or 'x64' as arch arg");
    return cb(er);
  }
  if (isNaN(parseFloat(nwVersion)) && !isNaN(parseFloat(nwVersion.slice(1)))) {
    nwVersion = nwVersion.slice(1);
  } else if (!isNaN(parseFloat(nwVersion))) {
  } else {
    var er = new Error("Invaild nw.js version");
    return cb(er);
  }

  // parse download
  var url = config.nwReleaseUrl + "/v" + nwVersion;
  if (parseFloat(nwVersion) > 0.11) {
    url += ["/nwjs-v"+nwVersion, pl, arch].join("-");
  } else {
    url += ["/node-webkit-v"+nwVersion, pl, arch].join("-");
  }
  if (pl === "linux") url += ".tar.gz";
  else url += ".zip";

  var fullName = url.slice(config.nwReleaseUrl.length + 3 + nwVersion.length),
      cache = path.resolve(config.cacheDir, fullName),
      dest = nwapp.link
            ? path.resolve(config.cacheDir, ["nwjs-v"+nwVersion, pl, arch].join("-"))
            : path.resolve(process.cwd());
  if (fs.existsSync(cache)) {
    // already downloaded, try to unpack
    // if error, rm cache and re-download and unpack
    npmlog.info(fullName+" already downloaded");
    npmlog.warn("directly use this cache file");
    npmlog.warn("if you don't get complete nw.js, please delete this cache "+cache);
    npmlog.warn("and run again");
    npmlog.info("unpacking into current directory");
    var unpacking = spawn("node", [path.resolve(__dirname, "unzip.js"), cache, dest]);
    unpacking.stdout.on("data", function (data) {
      var out = data.toString("ascii");
      npmlog.info(out);
    });
    unpacking.stderr.on("data", function (data) {
      var out = data.toString("ascii");
      npmlog.error(out);
      npmlog.error("maybe the compressed file is broken");
      rimraf.sync(cache);
      npmlog.info("retrying...");
      return cacheNW(fullName, url, cache, dest);
    });
    unpacking.on("close", function (code, res) {
      if (nwapp.link) {
        // create symlink
        var platforms = {
          "linux": "nw",
          "osx": "nwjs.app",
          "win": "nw.exe"
        };
        var target = path.resolve(dest, platforms[pl]),
            symlink = path.resolve(process.cwd(), platforms[pl]);
        npmlog.info("unpack finished");
        fs.symlinkSync(target, symlink);
        return cb(null, ["link", target, "to", symlink].join(" "));
      }
      return cb(null, "unpack finished");
    });
  } else {
    cacheNW(fullName, url, cache, dest);
  }

  function cacheNW(fullName, url, cache, dest) {
    npmlog.info("begin to download", fullName);
    var download = wget.download(url, cache);
    download.on("error", function (er) {
      return cb(er);
    });
    download.on("progress", function (state) {
      log("Downloaded "+(state*100).toFixed()+"%");
    });
    download.on("end", function (res) {
      console.log("\nDownload finished");
      var unpacking = spawn("node", [path.resolve(__dirname, "unzip.js"), cache, dest]);
      unpacking.stdout.on("data", function (data) {
        var out = data.toString("ascii");
        npmlog.info(out);
      });
      unpacking.stderr.on("data", function (data) {
        var out = data.toString("ascii");
        npmlog.error(out);
        return cb(out);
      });
      unpacking.on("close", function (code, res) {
        return cb(null, "unpack finished");
      });
    });
  }
}

// generate nw app using tmeplates
// @templates: an arrary which records files path in templates
nwapp.generateNWapp = function (templates, cb) {
  return cb(null);
}

// while generating nw app from templates some files maybe conflict
// under this situation, nwk will bakup it into .nwk folder
// then use this function can restore nw app
nwapp.restoreNWapp = function (templates, cb) {
  return cb;
}
