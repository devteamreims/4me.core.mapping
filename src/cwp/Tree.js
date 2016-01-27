import _ from 'lodash';
import d from 'debug';
const debug = d('4me.cwp.Tree');

import Cwp from './Cwp';
import {validTypes} from './Cwp';
import cwpBootstrap from './bootstrap';

let instance = null;

export default class CwpTree {
  // Singleton pattern
  constructor() {
    if(!instance) {
      instance = this;
      instance._bootstrap();
    }
    return instance;
  }

  _bootstrap() {
    var self = this;

    debug('Bootstraping CwpTree');

    let loadedData = cwpBootstrap();

    if(!loadedData) {
      throw new Error('Failed to load CWP data');
    }

    self.tree = [];

    loadedData.forEach((s) => {
      var cwp = new Cwp(s);
      self.tree.push(cwp);
    });


    debug('Loaded %d CWPs', this.tree.length);

  }

  getAll() {
    return this.tree;
  }

  getById(cwpId = 0) {
    return this.tree.find((cwp) => cwp.id === parseInt(cwpId));
  }

  getByType(type = 'cwp') {
    if(validTypes.indexOf(type) === -1) {
      throw new Error(`${type} is not a valid cwp type`);
    }
    return this.tree.filter((cwp) => cwp.type === type);
  }

}
