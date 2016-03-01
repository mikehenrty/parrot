// time between data callbacks
const SAMPLE_DELTA = 1000;

var Mic = require('mic');
var concat = require('concat-stream');

function Microphone(options) {
  options = options || {};
  this.mic = Mic({
    'rate': '16000',
    'channels': '1',
    //'debug': true,
    //'exitOnSilence': 6
  });
  this.stream = this.mic.getAudioStream();
  this.sampleDelta = options.sampleDelta || SAMPLE_DELTA
}

Microphone.prototype.start = function(cb) {
  buffer = concat(cb);
  this.startTime = Date.now();

  this.stream.on('data', (data) => { 
    buffer.write(data);
    if (Date.now() - this.startTime > this.sampleDelta) {
      buffer.end();
      this.startTime = Date.now();
      buffer = concat(cb);
    }
  });
  this.stream.on('error', function(e) {
    console.log('error: ' + e);
  });
  
  this.mic.start();
};

module.exports = Microphone;
