var npm = require("npm");
var nopt = require("nopt");

var confDefs = require("./lib/config/confDefs.js");
var parsed = nopt(confDefs.types, confDefs.shorthands);

var command = parsed.argv.remain.shift();

console.log(parsed);

npm.load(parsed, function (argument) {
  //var list = npm.config.get("list");
  //console.log(npm.config);
  //return;
  npm.commands[command](parsed.argv.remain, function(err, data){
    return;
  });
});
