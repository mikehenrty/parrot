const USER_ID = '7541f5d54a821a7750d274964a4b7d00';
const API_URL = 'http://192.168.1.2/api/' + USER_ID + '/';

var request = require('request');

function getHueValue(color) {
  switch (color) {
    case 'BLUE':
      return 46920;
    case 'RED':
      return 0;
    case 'YELLOW':
      return 12750;
    case 'GREEN':
      return 25500;
    case 'ORANGE':
      return 6000;
   }
}

function setLightHue(light, color) {
  request({
    url: API_URL + 'lights/' + light + '/state',
    method: 'PUT',
    json: true,
    body: {
      hue: getHueValue(color)
    }
  }, function(e, r, b) {
    console.log('response', b);
  });
}

module.exports = {
  setColor: function(color) {
    setLightHue(1, color);
    setLightHue(2, color);
    setLightHue(3, color);
  }
};
