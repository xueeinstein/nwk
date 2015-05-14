var expect = require("chai").expect;

var fs = require("fs"),
    nwapp = require("../lib/nwapp.js");

describe("nwapp", function () {
  describe("#get()", function () {
    it("download nw.js realse version into cwd, taking nw.js-v0.12.0 as an example", function(done) {
      var tmp = path.resolve(__dirname, "..", "nwktmp");
      shjs.mkdir('-p', tmp);
      process.chdir(tmp);
      nwapp.get("0.12.0", function (er, res) {
        if (er) throw er;
        var isDownloaded = false;
        switch (process.platform) {
          case "linux":
            isDownloaded = fs.existsSync("nw");
            break;
          case "darwin":
            isDownloaded = fs.existsSync("nwjs.app");
            break;
          case "win":
            isDownloaded = fs.existsSync("nw.exe");
            break;
          default:
            break;
        }
        expect(isDownloaded).to.equal(true);

        var isRightVersion = false;
        process.chdir(__dirname);
        done();
      });
    });
  });
});
