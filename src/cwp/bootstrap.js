import cwpStaticData from '../../config/cwps'
import d from 'debug';
import _ from 'lodash';

const debug = d('4me.cwp.bootstrap');

/* Load json, log, returns a tree object */

export default function() { 

  debug('Loading %d CWPs from files', cwpStaticData.length);
  
  return cwpStaticData;

};