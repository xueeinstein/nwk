// This module generate phony config which
// is used for npm.load, and then could call
// npm other function programmatically
var phonyConf = module.exports;

var objectAssign = require("object-assign");

// phony npm view config
// npm view pkg item
phonyConf.view = function (pkg, item) {
  var original = ["view", pkg, item],
      cooked = original,
      remain = cooked.slice(1);

  var argv = objectAssign({
        remain: remain}, {
        cooked: cooked}, {
        original: original
      });
  return objectAssign({argv: argv}, {_exit: true});
}

phonyConf.install = function (pkg, nwVersion) {
  var original = ["install", pkg, "-nw="+nwVersion],
      cooked = ["install", pkg, "-nw", nwVersion],
      remain = [pkg];

  var argv = objectAssign({
        remain: remain}, {
        cooked: cooked}, {
        original: original
      });
  return objectAssign({nw: nwVersion}, {argv: argv}, {_exit: true});
}
