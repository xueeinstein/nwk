var npm = require("npm");
var nopt = require("nopt");
var install = require("./install.js")
exports = module.exports = {};

exports.getConfig = function(args) {
	args = args | {};
	return nopt(args);
}

exports.isValidated = function(args) {
	return true;
}
exports.command = "help";
exports.argv = [];
exports.commands = function(args) {
	debugger
	npm.load(args, function (er) {
		// TODO, finish customized handlError
		if (er) return handlError(er)
		if (exports.command === "install") {
			// re-implement "npm install"
			exports.nwkInstall(
				exports.argv,
				function(er, data){
				if (er) {
					console.log("install failed");
					return;
				}
				console.log("get data");
				console.log(data);
			});
		} else {
			npm.commands[exports.command](
				exports.argv,
				function(er, data){
			});
		}
	});
	return console.log("finished");
}

exports.nwkInstall = install;
function hi(args, cb) {
	console.log("install...", args);
	if (args.length == 0) {
		// TODO
		// read package.json and install deps one by one
		npm.commands.install(args, function(er, data){
			if (er) {
				console.log(er.message);
				return cb(er, null);
			}
			return cb(null, data);
		});
	} else {
		for (var i = 0, len = args.length; i < len; i++) {
			exports.nwkSingleInstall(args[i], function(er) {
				if (er) {
					console.log(er.message);
					return cb(er);
				}
				return;
			});
		}
		args.push('scripts');
		npm.commands.view(args, function(er, data){
			if (er) {
				console.log(er);
				return cb(er, null);
			}
			return cb(null, data);
		});
	}
}

exports.nwkSingleInstall = function(pkg, cb) {
	var args = [pkg, "script.install"]
	var installScript = null;
	npm.commands.view(args, function(err, data) {
	});
}
