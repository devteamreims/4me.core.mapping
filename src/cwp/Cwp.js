import d from 'debug';
import _ from 'lodash';

const debug = d('4me.cwp.Cwp');

export default class Cwp {

  constructor(obj) {
    if(!obj) {
      throw new Error('Invalid argument');
    }
    // Sanitize input
    if(!obj.id || !parseInt(obj.id)) {
      throw new Error('Invalid argument : Could not build CWP without an id');
    }

    if(obj.disabled === undefined) {
      debug('Constructing CWP %d without disabled status', parseInt(obj.id));
    }

    if(!obj.ipAddr) {
      debug('Constructing CWP %d without ip addresses', parseInt(obj.id));
    }

    if(!obj.suggestions) {
      debug('Constructing CWP %d without suggestions', parseInt(obj.id));
    }

    this.id = parseInt(obj.id);
    this.name = obj.name || 'P' + this.id;
    this.disabled = !!obj.disabled;
    this.ipAddr = obj.ipAddr || [];
    this.suggestions = Object.assign({filteredSectors: [], preferenceOrder: []}, _.cloneDeep(obj.suggestions));

  }

};