var expect = require("chai").expect;

var fs = require("fs"),
    path = require("path"),
    shjs = require("shelljs"),
    spawn = require("child_process").spawn,
    nwapp = require("../lib/nwapp.js");

describe("nwapp", function () {
  describe("#get()", function () {
    it("download nw.js release version into cwd, taking nw.js-v0.12.0 as an example", function(done) {
      this.timeout(1500000);
      var tmp = path.resolve(__dirname, "..", "nwktmp");
      shjs.mkdir('-p', tmp);
      process.chdir(tmp);
      var pl = process.platform;
      if (pl === "darwin") pl = "osx";
      else if (pl === "win32" || pl === "cygwin") pl = "win";
      nwapp.get("0.12.0", pl, process.arch, function (er, res) {
        if (er) throw er;
        console.log("record:", res);
        var isDownloaded = false;
        var platforms = {
          "linux": "nw",
          "osx": "nwjs.app",
          "win": "nw.exe"
        }
        console.log(platforms[pl]);
        console.log(process.cwd());
        isDownloaded = fs.existsSync(platforms[pl]);
        expect(isDownloaded).to.equal(true);

        var isRightVersion = false;
        // make test nw app
        shjs.cp(
            "-f",
            "../assets/templates/test-nw-version/index.html",
            "../assets/templates/test-nw-version/package.json",
            "."
            );
        // On OS X, the execuable file is different
        platforms.darwin = "nwjs.app/Contents/MacOS/nwjs";
        var nw = spawn("./"+platforms[pl]);
        nw.stdout.on("data", function (data) {
          var out = data.toString("ascii");
          console.log("stdout:", out);
          if (out == "0.12.0") {
            isRightVersion = true;
          } else {
            console.log("NW.js version isn't RIGHT!");
            console.log("It should get NW.js 0.12.0, but it downloaded NW.js", nwConsole);
          }
        });
        nw.stderr.on("data", function (data) {
          var out = data.toString("ascii");
          console.log("stderr:", out);
        });
        nw.on("close", function (code, singal) {
          console.log("got singal: ", singal);
        });
        setTimeout(function(){
          nw.kill("SIGHUP");
          process.chdir(__dirname);
          expect(isRightVersion).to.equal(true);
          done();
        }, 3000);
      });
    });
  });
});
