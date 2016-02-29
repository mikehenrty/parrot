var ps = require('pocketsphinx').ps;
var Microphone = require('mic');
var concat = require('concat-stream');

function getDecoder() {
  var modeldir = "../pocketsphinx/model/en-us/";
  var config = new ps.Decoder.defaultConfig();
  config.setString("-hmm", modeldir + "en-us");
  config.setString("-dict", './colors.dic');
  config.setString("-lm", './colors.lm');
  config.setString('-logfn', '/dev/null');
  config.setString("-kws", './colors.kws');
  return new ps.Decoder(config);
}

function getMicrophone() {
  return Microphone({
    'rate': '16000',
    'channels': '1',
    //'debug': true,
    //'exitOnSilence': 6
  });
}

var words = [];
function processWords(newWords) {
  words = words.concat(newWords.split(' '));
  console.log('processing words', words);
  while (words.length > 1) {
    while (words.length > 0 && words[0] !== 'LIGHTS') {
      console.log('threw away', words.shift());
    }
    if (words.length > 1) {
      console.log('let there be', words.shift());
      if (words[0] !== 'LIGHTS') {
        console.log('COMMAND!', words.shift());
      }
    }
  }
}

function decode(data) {
  decoder.processRaw(data, false, false);
  var hyp = decoder.hyp();
  if (hyp) {
    processWords(hyp.hypstr);
  }
}

var mic = getMicrophone();
var stream = mic.getAudioStream();
buffer = concat(decode);

var decoder = getDecoder();
decoder.startUtt();

var startTime = Date.now();
stream.on('data', function (data) {
  buffer.write(data);
  if (Date.now() - startTime > 1000) {
    buffer.end();
    startTime = Date.now();
    buffer = concat(decode);
    decoder.endUtt();
    decoder.startUtt();
  }
});
stream.on('error', function(e) {
  console.log('error: ' + e);
});

mic.start();
