var westCwp = require('./west.json');
var eastCwp = require('./east.json');
var nightCwp = require('./night.json');

var RMS = westCwp.concat(eastCwp).concat(nightCwp);

module.exports = RMS;
