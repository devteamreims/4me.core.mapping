let westCwp = require('./west.json');
let eastCwp = require('./east.json');
let nightCwp = require('./night.json');
let specials = require('./specials.json');

let RMS = westCwp.concat(eastCwp).concat(nightCwp).concat(specials);

module.exports = RMS;
