var fs = require('fs');
var ps = require('pocketsphinx').ps;
var Microphone = require('mic');
var concat = require('concat-stream');

function getDecoder() {
  var modeldir = "../pocketsphinx/model/en-us/";
  var config = new ps.Decoder.defaultConfig();
  config.setString("-hmm", modeldir + "en-us");
  config.setString("-dict", modeldir + "cmudict-en-us.dict");
  config.setString("-lm", modeldir + "en-us.lm.bin");
  return new ps.Decoder(config);
}

function getMicrophone() {
  return Microphone({
    'rate': '16000',
    'channels': '1',
    'debug': true,
    'exitOnSilence': 6
  });
}

var decoder = getDecoder();
function decode(data) {
    console.log('decoding');
    decoder.startUtt();
    decoder.processRaw(data, false, false);
    decoder.endUtt();
    console.log(decoder.hyp())
}

var outStream = fs.WriteStream('output.raw');
var mic = getMicrophone();
var stream = mic.getAudioStream();
stream.pipe(outStream);
buffer = concat(decode);

var startTime = Date.now();
stream.on('data', function (data) {
  console.log('got data', data.length);
  if (Date.now() - startTime > 1500) {
    console.log('stopping');
    mic.stop();
    buffer.end();
  } else {
    buffer.write(data);
  }
});
stream.on('error', function(e) {
  console.log('error: ' + e);
});

mic.start();
/*
fs.readFile("./output.raw", function(err, data) {
    decoder.startUtt();
    decoder.processRaw(data, false, false);
    decoder.endUtt();
    console.log(decoder.hyp())
});
*/
