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
});
