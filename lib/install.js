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
// 1. install pure js node.js package
// 2. install node.js native module which uses node-gyp to build
// 3. install node.js native module which uses node-pre-gyp to build
// Generally, type 3 is the most complicate state, because the tool
// node-pre-gyp is designed too complicate and even some bugs in locating
// native module binary file
install.checkInstallType = function (args) {
  npm.load(args, function (er) {
    var pkg = ""
    if (er) return errorHandler(er);
    npm.commands.view(nwk.argv, function(er){
      if (nwk.command === "help") {
        return errorHandler();
      }
      return errorHandler(er); // npm default handler
    });
  });
}

