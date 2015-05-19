var config = module.exports;
var path = require("path"),
    https = require("https");

// nw.js dist url where to download nw.js & nw_headers
config.nwDistUrl = "http://node-webkit.s3.amazonaws.com";
config.nwReleaseUrl = "http://dl.nwjs.io";

config.cacheDir = getCacheDir();

// latest nw.js release version
config.latestVer = getLatestVer;

function getUserHome() {
  return process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"];
}

function getCacheDir() {
  return path.join(getUserHome(), ".nwk");
}

function getLatestVer() {
  if (arguments.length === 0) {
    var er = new Error("No callback");
    throw(er);
  }
  var cb = arguments[0],
      latestVer = "0.12.0";
  var options = {
    host: "raw.githubusercontent.com",
    path: "/nwjs/nw.js/master/src/nw_version.h",
    proxy: process.env["HTTP_PROXY"] || process.env["http_proxy"] || "",
    port: 443,
    method: "GET"
  };

  function cb_(res) {
    var nwCode = "";
    res.on("data", function (chunk) {
      nwCode += chunk;
    });
    res.on("end", function () {
      latestVer = parseNWVer(nwCode);
      return cb(null, latestVer);
    });
    res.on("error", function (er) {
      return cb(er, latestVer);
    });
  }

  // from nwjs/nw.js/master/src/nw_version.h
  // getting nwjs latest release version
  function parseNWVer(code) {
    var i = code.indexOf("#define NW_MAJOR_VERSION"),
        j = code.indexOf("#define NW_VERSION_IS_RELEASE"),
        main = code.slice(i, j).split("\n").slice(0, -1),
        vers = main.map(function(v){
          return v.split(" ")[2];
        });
    return vers.join(".");
  }
  // ignore self-signed ssl certificate
  // to get nw_version code on github
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  https.request(options, cb_).end();
}
