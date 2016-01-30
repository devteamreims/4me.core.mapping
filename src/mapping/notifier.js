import _ from 'lodash';
import d from 'debug';
const debug = d('4me.mapping.notifier');

import mySocket from '../socket';

export function notify(oldMap, newMap) {
  if(!oldMap && !newMap) {
    throw new Error('Invalid argument');
  }
  let changedNew = [];
  let changedOld = [];

  // List all affected CWPs
  let cwpIds = _.union(
    _.map(oldMap, (m) => m.cwpId),
    _.map(newMap, (m) => m.cwpId)
  );

  let changedCWpIds = _.filter(cwpIds, (cwpId) => {
    return !_.eq(getSectors(cwpId, newMap), getSectors(cwpId, oldMap))
  });

  mySocket.emitToCwps(changedCWpIds, 'mapping:refresh');
}

const getSectors = (cwpId, map) => {
  return _.get(_.find(map, (m) => cwpId === m.cwpId), 'sectors', []).sort();
}

export default {
  notify: notify
}