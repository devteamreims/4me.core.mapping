/*
 * Identify CWPs
 * Expects a 'req' object, returns a valid cwpId
 * See here :
 * http://expressjs.com/en/guide/behind-proxies.html
 */

import _ from 'lodash';


export function reqToCwpId(req, cwpTree) {
  if(req === undefined || req.ip === undefined || cwpTree.getAll === undefined) {
    throw new Error('Invalid argument');
  }

  let cwp = _.find(cwpTree.getAll(), (c) => c.ipAddr.indexOf(req.ip) !== -1);

  if(_.isEmpty(cwp)) {
    return -1;
  }

  return cwp.id;
};

export default {
  reqToCwpId: reqToCwpId
};
