// nwk install <pkg> -nw=<nw.js version>
// or
// in a directory with package.json, just run
// nwk install -nw=<nw.js version>
var install = module.exports;

var npm = require("npm"),
    nwk = require("./nwk.js"),
    nodedir = require("./nodedir.js"),
    errorHandler = require("./utils/error-handler.js");

install.install = function (args) {

}
// Here, installation has three different types:
// 1. install pure js node.js package ("PUREJS")
// 2. install node.js native module which uses node-gyp to build ("ADDONS_I")
// 3. install node.js native module which uses node-pre-gyp to build ("ADDONS_II")
// Generally, type 3 is the most complicate state, because the tool
// node-pre-gyp is designed too complicate and even some bugs in locating
// native module binary file
// checkInstallType() is a sync function
install.checkInstallType = function (pkg) {
  // generate phony conf
  var conf = {};
  npm.load(conf, function (er) {
    if (er) return errorHandler(er);
    npm.commands.view([pkg, "scripts.install"], function(er, data){
      if (er) return errorHandler(er); // npm default handler
      if (data) {
        return "PUREJS";
      }
    });
  });
}

