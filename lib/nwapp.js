// nwapp, help get and update nw.js
// also support nw.js node modules self test

var nwapp = module.exports;

var fs = require("fs"),
    path = require("path"),
    wget = require("wget"),
    rimraf = require("rimraf"),
    tarball = require("tarball-extract"),
    log = require('single-line-log').stdout,
    config = require("../config.js");

// get nw.js and unpack into current folder
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
    url += "/nwjs-v" + nwVersion + "-" + pl + "-" + arch;
  } else {
    url += "/node-webkit-v" + nwVersion + "-" + pl + "-" + arch;
  }
  if (pl === "linux") url += ".tar.gz";
  else url += ".zip";

  var fullName = url.slice(config.nwReleaseUrl.length + 3 + nwVersion.length),
      cache = path.resolve(config.cacheDir, fullName),
      dest = path.resolve(process.cwd());
  if (fs.existsSync(cache)) {
    rimraf.sync(cache);
  }
  var download = wget.download(url, cache);
  download.on("error", function (er) {
    return cb(er);
  });
  download.on("progress", function (state) {
    log("Downloaded "+(state*100).toFixed()+"%");
  });
  download.on("end", function (res) {
    console.log("\nDownload finished");
    tarball.extractTarball(cache, dest, function (er, res) {
      return cb(er, res);
    });
  });
}
