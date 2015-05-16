// nwk error handler
module.exports = nwkErrorHandler;

var log = require("npmlog");

// currently, a simple implementation
// TODO, enhance it!
function nwkErrorHandler(er, res) {
  if (er) return log.error(er);
  return log.info(res);
}
