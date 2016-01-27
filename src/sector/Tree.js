import _ from 'lodash';
import d from 'debug';
const debug = d('4me.sectors.model');

import Sector from './Sector';
import sectorBootstrap from './bootstrap';

let instance = null;

export default class SectorTree {
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

    self.elementary = [];
    debug('Bootstraping SectorTree');

    if(!(self.tree = sectorBootstrap())) {
      throw new Error('Failed loading sector tree');
    }

    const tempTree = [];
    self.tree.forEach((s) => {
      var sector = new Sector({
        name: s.name,
        elementarySectors: s.elementarySectors,
        canGive: s.canGive,
        canAccept: s.canAccept
      }, self);
      tempTree.push(sector);

      if(sector.elementarySectors.length === 1) {
        self.elementary.push(sector.name);
      }
    });

    this.tree = tempTree;
    debug('Loaded %d sector configurations', this.tree.length);
    debug('Extracted %d elementary sectors : %s', this.elementary.length, this.elementary.join(', '));

  }

  getTree() {
    return this.tree;
  }

  getElementary() {
    return this.tree.filter((s) => s.elementarySectors.length === 1);
  }

  getSector(sectorName = '') {
    return this.tree.find((s) => s.name === sectorName) || null;
  }

  getFromElementary(elementarySectors = []) {
    return this.tree.find((s) => s.elementarySectors.sort() === elementarySectors.sort());
  }

}
