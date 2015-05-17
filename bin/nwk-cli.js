#!/usr/bin/env node
var nopt = require("nopt"),
    nwk = require("../lib/nwk.js"),
    confDefs = require("../lib/config/confDefs.js"),
    errorHandler = require("../lib/utils/error-handler.js");
var parsed = nopt(confDefs.types, confDefs.shorthands);

nwk.argv = parsed.argv.remain
if (nwk.argv[0]) nwk.command = nwk.argv.shift()
else parsed.usage = true

if (parsed.version) {
  console.log(nwk.version)
  return
}

if (parsed.versions) {
  nwk.command = "version"
  parsed.usage = false
  nwk.argv = []
}

process.on("uncaughtException", errorHandler);
if (parsed.usage && nwk.command !== "help") {
  nwk.argv.unshift(nwk.command)
  nwk.command = "help"
}

parsed._exit = true
console.log(parsed);

if (nwk.isValidated(parsed)) {
  nwk.commands(parsed);
}
