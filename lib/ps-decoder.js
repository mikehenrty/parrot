const MODEL_DIR = '../pocketsphinx/model/en-us/';

var ps = require('pocketsphinx').ps;

function PocketsphinxDecoder(options) {
  options = options || {};

  this.config = new ps.Decoder.defaultConfig();
  this.config.setString("-hmm", MODEL_DIR + "en-us");
  this.config.setString("-dict", './colors.dic');
  this.config.setString("-lm", './colors.lm');
  this.config.setString('-logfn', '/dev/null');
  this.config.setString("-kws", './colors.kws');
  this.decoder = new ps.Decoder(this.config);
}

PocketsphinxDecoder.prototype.decode = function(data) {
  this.decoder.startUtt();
  this.decoder.processRaw(data, false, false);
  var hyp = this.decoder.hyp();
  this.decoder.endUtt();
  return hyp && hyp.hypstr;
};

module.exports = PocketsphinxDecoder;
