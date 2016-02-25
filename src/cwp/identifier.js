/*
 * Identify CWPs
 * Expects a 'req' object, returns a valid cwpId
 * See here :
 * http://expressjs.com/en/guide/behind-proxies.html
 */

import _ from 'lodash';
import d from 'debug';
const debug = d('4me.cwp.identifier');

export function reqToCwpId(req, cwpTree) {
  if(req === undefined || req.ip === undefined || cwpTree.getAll === undefined) {
    throw new Error('Invalid argument');
  }

  
  let cwp = _.find(cwpTree.getAll(), (c) => c.ipAddr.indexOf(req.ip) !== -1);

  if(_.isEmpty(cwp)) {
    debug(`Got a request from an unknown IP ${req.ip}`);

    if(process.env.FOURME_DEMO) {
      const demoCwpId = 32;
      debug(`Demo mode enabled, returning cwpId ${demoCwpId}`);
      return demoCwpId;
    }
    return -1;
  }

  return cwp.id;
};

export default {
  reqToCwpId: reqToCwpId
};
