var config = module.exports;
var path = require("path");

// nw.js dist url where to download nw.js & nw_headers
config.nwDistUrl = "http://node-webkit.s3.amazonaws.com";
config.nwReleaseUrl = "http://dl.nwjs.io";

config.cacheDir = getCacheDir();

function getUserHome() {
  return process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"];
}

function getCacheDir() {
  return path.join(getUserHome(), ".nwk");
}
