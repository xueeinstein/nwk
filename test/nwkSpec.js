var expect = require("chai").expect;
var nwk = require("../lib/nwk.js");

describe("nwk", function(){
  describe("#isValidated()", function() {
    it("should always be true now", function(){
      var args = "";
      var results = nwk.isValidated(args);

      expect(results).equal(true);
    });
  });
});
