import _ from 'lodash';
import d from 'debug';
import Promise from 'bluebird';
const debug = d('4me.mapping.Map');

import CwpTree from '../cwp/Tree';
import SectorTree from '../sector/Tree';
import database from '../database';
import mapValidator from './validator';
import mapNotifier from './notifier';

let instance = null;
let db = database();

let cwpTree = new CwpTree();
let sectorTree = new SectorTree();

/* This is fully asynchronous */

class Map {
  // Singleton pattern
  constructor() {
    if(!instance) {
      return this
        ._bootstrap()
        .then((self) => {
          instance = self;
          return instance;
        })
        .catch((err) => { debug('Failed to instanciate Map'); throw err; });
    }
    return Promise.resolve(instance);
  }

  _bootstrap() {
    debug('Bootstraping Map');
    this.map = [];
    return this._getFromDb();
  }

  _getFromDb() {
    let self = this;
    return db.get('map')
      .then((m) => {
        self.map = m;
        return self;
      })
      .catch((err) => {
        if(err.notFound) {
          debug('Data not found in the database');
          return self._createEmptyMap();
        } else {
          throw err;
        }
      });
  }

  _createEmptyMap() {
    debug('Creating a valid map');

    // Let's find a CWP to bind every sector
    let cwp = _.first(cwpTree.getByType('cwp'));
    if(!cwp || !cwp.id) {
      return Promise.reject(new Error('Could not find a single CWP to bind sectors'));
    }

    // Find every single sector
    let sectors = sectorTree.getElementary();
    if(!sectors || sectors.length === 0) {
      return Promise.reject(new Error(`Could not find a single sector to bind to ${cwp.id}`));
    }

    debug(`Assigning all sectors to CWP #${cwp.id}`);

    let sectorsToBind = sectors.map((s) => s.name);

    let sector = sectorTree.getFromElementary(sectorsToBind);

    let sectorName = sector.name || '';

    // Create our single mapping item
    let mappingItem = {
      cwpId: cwp.id,
      sectors: _.clone(sectorsToBind.slice()),
      sectorName: sectorName
    };

    debug(`CWP #${cwp.id} is now ${sectorName}`);

    let map = [mappingItem];

    try {
      validate(map);
    } catch(err) {
      return Promise.reject(err);
    }
    this.map = [mappingItem];

    return this.store().then(() => this);
  }

  store() {
    return db.put('map', this.map);
  }

  get() {
    return this.map;
  }

  set(map = {}) {
    
    validate(map);
    // Find changed CWPs to send an event;
    let changedCwps = [];

    mapNotifier.notify(this.map, map);

    this.map = map;
    return this.store();
  }

}



export function validate(map) {
  return mapValidator.validate(map, cwpTree, sectorTree);
}

export function getInstance() {
  return new Map();
}

export default {
  getInstance: getInstance,
  validate: validate
};
