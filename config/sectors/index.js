var blocN = require('./4N.json');
var blocR = require('./5R.json');
var URMN = require('./URMN.json').concat(blocN).concat(blocR);

var blocE = require('./4E.json');
var FIR = require('./FIR.json');
var blocH = require('./4H.json');
var KD2F = require('./KD2F.json');

var RFUE = require('./RFUE.json')
            .concat(blocE).concat(blocH)
            .concat(FIR).concat(KD2F);

var RMS = require('./RMS.json').concat(RFUE).concat(URMN);

export default RMS;
