var expect = require("chai").expect;

var fs = require("fs"),
    path = require("path"),
    shjs = require("shelljs"),
    spawn = require("child_process").spawn,
    nwapp = require("../lib/nwapp.js");

describe("nwapp", function () {
  describe("#get()", function () {
    it("download nw.js realse version into cwd, taking nw.js-v0.12.0 as an example", function(done) {
      this.timeout(150000);
      var tmp = path.resolve(__dirname, "..", "nwktmp");
      shjs.mkdir('-p', tmp);
      process.chdir(tmp);
      nwapp.get("0.12.0", function (er, res) {
        if (er) throw er;
        var isDownloaded = false;
        var platforms = {
          "linux": "nw",
          "darwin": "nwjs.app",
          "win32": "nw.exe",
          "cygwin": "nw.exe"
        }
        isDownloaded = fs.existsSync(platforms[process.platform]);
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
        var nw = spawn(platforms[process.platform]);
        nw.stdout.on("data", function (data) {
          console.log("stdout:", data);
        });
        nw.stderr.on("data", function (data) {
          var out = data.toString("ascii");
          //console.log("stderr:", out);
          //console.log(out.split(" "));
          nwConsole = out.split(" ")[1].slice(2, -3);
          console.log(nwConsole);
          if (nwConsole == "0.12.0") {
            isRightVersion = true;
          } else {
            console.log("NW.js version isn't RIGHT!");
            console.log("It should get NW.js 0.12.0, but it downloaded NW.js", nwConsole);
          }
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
