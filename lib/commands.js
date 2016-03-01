var Microphone = require(__dirname + '/microphone.js');
var Decoder = require(__dirname + '/ps-decoder.js');

function Commands(keyword, list) {
  this.keyword = keyword;
  this.list = list;
  this.words = [];
}

Commands.prototype.processWords = function(newWords) {
  this.words = this.words.concat(newWords.split(' '));
  var words = this.words;
  console.log('processing words', words);
  while (words.length > 1) {
    while (words.length > 0 && words[0] !== this.keyword) {
      console.log('threw away', words.shift());
    }
    if (words.length > 1) {
      console.log('let there be', words.shift());
      if (this.list.indexOf(words[0]) !== -1) {
        var command = words.shift();
        console.log('COMMAND!', command);
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
