// Ignore this file, just for node debug easily!
var npm = require("npm");
var nopt = require("nopt");
var DecompressZip = require("decompress-zip");

var confDefs = require("./lib/config/confDefs.js");
var parsed = nopt(confDefs.types, confDefs.shorthands);

var command = parsed.argv.remain.shift();

//var nwapp = require("./lib/nwapp.js");
//nwapp.get("0.12.0", "osx", "x64", null);
var unzipper = new DecompressZip("/Users/nw/.nwk/nwjs-v0.12.0-osx-x64.zip");
unzipper.on('error', function (er) {
  return cb(er);
});
unzipper.on('extract', function (log) {
  console.log('Finished extracting');
  return cb(null, "got "+fullName);
});
unzipper.on('progress', function (fileIndex, fileCount) {
  console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
});
unzipper.extract({
  path: "./nwktmp/",
  filter: function (file) {
    return file.type !== "SymbolicLink";
  }
});
