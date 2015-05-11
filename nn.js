var npm = require("npm");
var nopt = require("nopt");

var confDefs = require("./lib/config/confDefs.js");
var parsed = nopt(confDefs.types, confDefs.shorthands);

var command = parsed.argv.remain.shift();

var nodedir = require("./lib/nodedir.js");
var fs = require("fs");
var path = require("path");
var errorHandler = require("./lib/utils/error-handler.js");
var config = require("./config.js");
nodedir.cache("0.8.3", function (er) {
	if (er) errorHandler(er);
	var isCached = fs.existsSync(path.resolve(config.cacheDir, "0.8.3"));
	console.log(isCached);
});
//console.log(parsed);

//npm.load(parsed, function (argument) {
  ////var list = npm.config.get("list");
  ////console.log(npm.config);
  ////return;
  //npm.commands[command](parsed.argv.remain, function(err, data){
    //return;
  //});
//});
