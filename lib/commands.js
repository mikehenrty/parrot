const DEBUG = false;

var Microphone = require(__dirname + '/microphone.js');
var Decoder = require(__dirname + '/ps-decoder.js');

function debug() {
  DEBUG && console.log.apply(console, 
    Array.prototype.slice.call(arguments));
}

function Commands(keyword, list) {
  this.keyword = keyword;
  this.list = list;
  this.words = [];
}

Commands.prototype.processWords = function(newWords) {
  this.words = this.words.concat(newWords.split(' '));
  var words = this.words;
  debug('processing words', words);
  while (words.length > 1) {
    while (words.length > 0 && words[0] !== this.keyword) {
      debug('threw away', words.shift());
    }
    if (words.length > 1) {
      debug('let there be', words.shift());
      if (this.list.indexOf(words[0]) !== -1) {
        var command = words.shift();
        debug('COMMAND!', command);
        this.cb(command)
      }
    } 
  } 
}

Commands.prototype.listen = function(cb) {
  this.cb = cb;
  var decoder = new Decoder();
  var microphone = new Microphone();
  microphone.start((data) => {
    var utterance = decoder.decode(data);
    utterance && this.processWords(utterance);
  });
};

module.exports = Commands;
