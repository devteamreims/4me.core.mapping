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

  // For now, just notify everyone
  if(_.isArray(oldMap)) {
    changedOld = oldMap.map((m) => m.cwpId);
  }

  if(_.isArray(newMap)) {
    changedNew = newMap.map((m) => m.cwpId);
  }

  let changed = _.uniq(changedNew.concat(changedOld));
  console.log('Notifying CWPs with IDs ' + changed.join(','));
  mySocket.emitToCwps(changed, 'mapping:refresh');
}

export default {
  notify: notify
}