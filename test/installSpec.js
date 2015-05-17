var expect = require("chai").expect;
var path = require("path"),
    shjs = require("shelljs"),
    nwk = require("../lib/nwk.js"),
    install = require("../lib/install.js"),
    phonyConf = require("../lib/config/phonyConf.js");

describe.skip("install", function () {
  describe("#checkInstallType()", function () {
    it("check pure js package, taking 'colors' as an example", function(done) {
      this.timeout(150000);
      install.checkInstallType("colors", function (er, res) {
        if (er) throw er;
        expect(res).to.equal("PUREJS");
        done();
      });
    });
    it("check addone package which using 'node-gyp' to install, taking 'bignum' as an example", function(done) {
      this.timeout(150000);
      install.checkInstallType("bignum", function (er, res) {
        if (er) throw er;
        expect(res).to.equal("ADDONS_I");
        done();
      });
    });
    it("check addone package which using 'node-pre-gyp' to install, taking 'sqlite3' as an example", function(done) {
      this.timeout(150000);
      install.checkInstallType("sqlite3", function (er, res) {
        if (er) throw er;
        expect(res).to.equal("ADDONS_II");
        done();
      });
    });
  });

  describe("#singlePkg()", function () {
    // TODO, add new test cases:
    // A(B, C) means that A deps on B & C
    // 1. PUREJS(ADDONS_I)
    // 2. PUREJS(ADDONS_II)
    // 3. ADDONS_I(ADDONS_II)
    // 4. ADDONS_II(ADDONS_I)
    it("install single pure js package 'colors' for nw.js-v0.12.0, under tmp dir", function(done) {
      this.timeout(150000);
      var conf = phonyConf.install("colors", "0.12.0"),
          tmp = path.resolve(__dirname, "..", "nwktmp");
      shjs.mkdir('-p', tmp);
      process.chdir(tmp);
      console.log(__dirname);
      console.log(process.cwd());
      install.singlePkg(conf, function (er, res) {
        if (er) {
          process.chdir(__dirname);
          throw er;
        }
        expect(res).to.equal("ok");
        process.chdir(__dirname);
        done();
      });
    });
    it("install ADDONS_I package 'bignum' for nw.js-v0.12.0, under tmp dir", function(done) {
      this.timeout(150000);
      var conf = phonyConf.install("bignum", "0.12.0"),
          tmp = path.resolve(__dirname, "..", "nwktmp");
      shjs.mkdir('-p', tmp);
      process.chdir(tmp);
      console.log(__dirname);
      console.log(process.cwd());
      install.singlePkg(conf, function (er, res) {
        if (er) {
          process.chdir(__dirname);
          throw er;
        }
        expect(res).to.equal("ok");
        process.chdir(__dirname);
        done();
      });
    });
    it("install ADDONS_II package 'sqlite3' for nw.js-v0.12.0, under tmp dir", function(done) {
      this.timeout(150000);
      var conf = phonyConf.install("sqlite3", "0.12.0"),
          tmp = path.resolve(__dirname, "..", "nwktmp");
      shjs.mkdir('-p', tmp);
      process.chdir(tmp);
      console.log(__dirname);
      console.log(process.cwd());
      install.singlePkg(conf, function (er, res) {
        if (er) {
          process.chdir(__dirname);
          throw er;
        }
        expect(res).to.equal("ok");
        process.chdir(__dirname);
        done();
      });
    });
  });

  describe.skip("#testBuild()", function () {
    it("detect node.js addons build error", function(done) {
      // sqlite3 should throw binary file path error
      install.testBuild("sqlite3". function (er) {
        if (er) {
          process.chdir(__dirname);
          throw er;
        }
      });
    });
  });
});
