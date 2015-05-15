var expect = require("chai").expect;
var config = require("../config.js"),
    path = require("path");

describe("nwk config", function() {
  describe("#cacheDir", function() {
    it("should be '.nwk' folder under user's home directory", function() {
      if (process.platform == "linux" || process.platform == "darwin") {
        var cacheDir = path.join(process.env["HOME"], ".nwk");
        expect(config.cacheDir).equal(cacheDir);
      }
    });
  });

  describe("#latestVer", function () {
    it("currently should be '0.12.1' as release version", function(done) {
      this.timeout(15000);
      config.latestVer(function (er, latest){
        if (er) throw er;
        expect(latest).to.equal("0.12.1");
        done();
      });
    });
  });
});
