import d from 'debug';
import SectorTree from './Tree';

const debug = d('4me.sector.Sector');

export default class Sector {

  constructor(obj, tree) {
    if(!obj || !tree || !(tree instanceof SectorTree)) {
      throw new Error('Invalid arguments');
    }
    // Sanitize input
    if(!obj.name || !obj.name.length) {
      throw new Error('Constructing a sector without a name');
    }
    if(!obj.elementarySectors || !obj.elementarySectors.length) {
      throw new Error('Trying to construct sector %s without elementarySectors', obj.name);
    }
    if(!obj.canGive) {
      debug('Constructing sector %s without canGive', obj.name);
    }
    if(!obj.canAccept) {
      debug('Constructing sector %s without canAccept', obj.id);
    }

    this.name = obj.name;
    this.elementarySectors = obj.elementarySectors;


    this.canGive = obj.canGive || [];
    this.canAccept = obj.canAccept || [];

    /* Sanitize canGive & canAccept */
    this.canGive.forEach((s) => {
      if(!tree.getSector(s)) {
        debug('WARNING: [Sector %s .canGive] : Sector %s does not exist', this.name, s);
      }
    });

    this.canAccept.forEach((s) => {
      if(!tree.getSector(s)) {
        debug('WARNING: [Sector %s .canAccept] : Sector %s does not exist', this.name, s);
      }
    });
  }

  isElementary() {
    return this.elementarySectors.length === 1;
  }
};