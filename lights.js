var Microphone = require('./lib/microphone.js');
var Decoder = require('./lib/ps-decoder.js');
var Hue = require('./lib/hue.js');

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
        var color = words.shift();
        console.log('COMMAND!', color);
        Hue.setColor(color);
      }
    }
  }
}

var decoder = new Decoder();
var microphone = new Microphone();
microphone.start(function(data) {
  var utterance = decoder.decode(data);
  utterance && processWords(utterance);
});

