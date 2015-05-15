// single program to unzip file
// as I met a weird problem: using decompress
// programatically don't work to unzip nw.js zip file!
var nopt = require("nopt"),
    Decompress = require("decompress");

var args = nopt();

console.log(args.argv.remain);
var decompressOptions = { strip: 1, mode: "755" };
var unpack = new Decompress({mode: "755"})
                .src(args.argv.remain[0])
                .dest(args.argv.remain[1])
  .use(Decompress.zip(decompressOptions))
  .use(Decompress.targz(decompressOptions))
  .run(cb);

function cb(error) {
  if( error != null ) {
    return logError( error )
  }
  process.nextTick(function() {
    console.log("Finished extracting");
    process.exit();
  });
}
