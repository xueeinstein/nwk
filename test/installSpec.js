var expect = require("chai").expect;
var install = require("../lib/install.js");

describe("install", function () {
  describe("#checkInstallType()", function () {
    it("check pure js package, taking 'colors' as an example", function(done) {
      var type = install.checkInstallType("colors");
      expect(type).to.equal("PUREJS");
    });
    it("check addone package which using 'node-gyp' to install, taking 'bignum' as an example", function(done) {
      var type = install.checkInstallType("bignum");
      expect(type).to.equal("ADDONS_I");
    });
    it("check addone package which using 'node-pre-gyp' to install, taking 'sqlite3' as an example", function(done) {
      var type = install.checkInstallType("sqlite3");
      expect(type).to.equal("ADDONS_II");
    });
  });
});
