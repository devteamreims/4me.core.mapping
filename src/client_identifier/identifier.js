/*
 * Identify CWPs
 * Expects a 'req' object, returns a valid cwpId
 * See here :
 * http://expressjs.com/en/guide/behind-proxies.html
 */

import _ from 'lodash';
import d from 'debug';
const debug = d('4me.cwp.identifier');

import cwpIps from '../../config/cwpIps.js';

export function reqToCwpId(req) {
  if(req === undefined || req.ip === undefined) {
    throw new Error('Invalid argument');
  }

  const cwp = _.find(cwpIps, c => c.ipAddr === req.ip);
  if(!cwp || !cwp.cwpId) {
    return -1;
  }

  return cwp.cwpId;
};
