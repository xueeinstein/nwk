var nodedir = module.exports;

var config = require("../config.js"),
    fs = require("fs"),
    tarball = require("tarball-extract"),
    path = require("path"),
    http = require("http"),
    log = require("npmlog"),
    rimraf = require("rimraf"),
    mkdirp = require("mkdirp");

nodedir.cache = function (nwVersion, cb) {
  var fullName = "nw-headers-v" + nwVersion + ".tar.gz",
      tmpCache = path.resolve(config.cacheDir, "cache"),
      dest = path.resolve(tmpCache, fullName),
      destDir = path.resolve(config.cacheDir, nwVersion);

  function cacheHeaders(nwVersion, cb) {
    var url = config.nwDistUrl + "/v" + nwVersion + "/" + fullName,
        tmp = path.resolve(tmpCache, "tmp");
    if (!fs.existsSync(tmpCache)) {
      mkdirp(tmpCache, function (er) {
        console.log(1);
        if (er) return cb(er);
      });
    }
    if (!fs.existsSync(destDir)) {
      tarball.extractTarballDownload(url, dest, tmp, {}, function (er, res) {
        //console.log(er, res);
        if (er) {
          if (fs.existsSync(destDir)) {
            rimraf.sync(destDir);
          }
          // TODO, here err.code doesn't work!
          er.code = "EGETNWHEADER";
          console.log(er);
          return cb(er);
        }
        fs.rename(path.resolve(tmp, "node"), destDir, function (er) {
          if (er) return cb(er);
          log.info("got nw-headers-v"+nwVersion);
          rimraf.sync(tmpCache);
          return cb();
        });
      });
    } else {
      log.info("nw-headers-v"+nwVersion+" already cached");
      return cb();
    }
  }

  if (!fs.existsSync(config.cacheDir)) {
    mkdirp(config.cacheDir, function (er) {
      if (er) return cb(er);
      cacheHeaders(nwVersion, cb);
    });
  } else {
    cacheHeaders(nwVersion, cb);
  }
}
