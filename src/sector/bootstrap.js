import sectorStaticData from '../../config/sectors'
import d from 'debug';
import _ from 'lodash';

const debug = d('4me.sector.bootstrap');

/* Load json, log, returns a tree object */

export default function() { 

  debug('Loading %d different configurations from files', sectorStaticData.length);
  
  return sectorStaticData;

};