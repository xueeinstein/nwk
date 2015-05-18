var expect = require("chai").expect,
    path = require("path"),
    fs = require("fs"),
    nodedir = require("../lib/nodedir.js"),
    config = require("../config.js"),
    errorHandler = require("../lib/utils/error-handler.js");

describe("nodedir", function () {
  describe("#cache()", function () {
    it("cache v0.12.0 nw-headers", function(done) {
      this.timeout(150000);
      nodedir.cache("0.12.0", function (er) {
        if (er) throw er;
        expect(fs.existsSync(path.resolve(config.cacheDir, "0.12.0"))).to.equal(true);
        done();
      });
    });

    it("cache unexist nw-headers should throw error", function(done) {
      this.timeout(150000);
      nodedir.cache("1.0.0", function (er) {
        expect(er).to.not.equal(null);
        done();
      });
    });
  });
});
