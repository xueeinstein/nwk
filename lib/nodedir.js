var nodedir = module.exports;

var config = require("../config.js"),
    fs = require("fs"),
    path = require("path"),
    http = require("http"),
    mkdirp = require("mkdirp");

nodedir.cache = function (nwVersion, cb) {
  function cacheHeaders(nwVersion) {
    var fullName = "nw_" + nwVersion + ".tar.gz",
        dest = path.resolve(config.cacheDir, fullName),
        headerFile = fs.createWriteStream(dest);

    var url = config.nwDistUrl;
    var req = http.get();
  }
  if (!path.existsSync(config.cacheDir)) {
    mkdirp(config.cacheDir, function (er) {
      if (er) return cb(er);
    });
  }
}
