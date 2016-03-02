var Commands = require('./lib/commands.js');
var Hue = require('./lib/hue.js');

var keyword = 'LIGHTS';
var colors =  [
  'RED', 'BLUE', 'YELLOW', 'GREEN', 'ORANGE'
];

var commands = new Commands(keyword, colors);
commands.listen(function(command) {
  console.log('got command', command);
  Hue.setColor(command);
});
