// Ignore this file, just for node debug easily!
var npm = require("npm");
var nopt = require("nopt");

var confDefs = require("./lib/config/confDefs.js");
var parsed = nopt(confDefs.types, confDefs.shorthands);

var command = parsed.argv.remain.shift();

//var nodedir = require("./lib/nodedir.js");
//var fs = require("fs");
//var path = require("path");
//var errorHandler = require("./lib/utils/error-handler.js");
//var config = require("./config.js");
//nodedir.cache("0.12.0", function (er) {
	//if (er) errorHandler(er);
	//var isCached = fs.existsSync(path.resolve(config.cacheDir, "0.8.3"));
	//console.log(isCached);
//});

var phonyConf = require("./lib/config/phonyConf.js");

var conf = phonyConf.view("colors", "scripts.install");
//console.log(conf);
//npm.load(conf, function (er) {
  //debugger
  //if (er) return errorHandler(er);
  //npm.commands.view(["colors", "scripts"], function(er, data){
    //if (er) return errorHandler(er); // npm default handler
    //if (data) {
      //console.log(data);
      //return "PUREJS";
    //}
  //});
//});
console.log(parsed);
var install = require("./lib/install.js");
debugger
var type = install.checkInstallType("colors");
console.log(type);
//npm.load(parsed, function (argument) {
  ////var list = npm.config.get("list");
  ////console.log(npm.config);
  ////return;
  //npm.commands[command](parsed.argv.remain, function(err, data){
    //return;
  //});
//});
