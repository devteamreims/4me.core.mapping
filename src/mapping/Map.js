import _ from 'lodash';
import d from 'debug';
import Promise from 'bluebird';
const debug = d('4me.mapping.Map');

import CwpTree from '../cwp/Tree';
import SectorTree from '../sector/Tree';
import database from '../database';


let instance = null;
let db = database();

let cwpTree;
let sectorTree;

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
    var self = this;

    debug('Bootstraping Map');

    try {
      cwpTree = new CwpTree();
      sectorTree = new SectorTree();
    } catch(ex) {
      return Promise.reject(ex);
    }

    return self._getFromDb();

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
          console.log('Data not found in the db');
          throw err;
        } else {
          throw err;
        }
      });
  }

  _createEmptyMap() {
    let self = this;
    debug('Creating a valid map');

    // Let's find a CWP to bind every sector
    let cwp = _.find(cwpTree.getByType('cwp'));
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

    let sectorName = sectorTree.getFromElementary(sectorsToBind).name || '';

    let mappingItem = {
      cwpId: cwp.id,
      sectors: _.clone(sectorsToBind.slice()),
      sectorName: sectorName
    };

    debug(`CWP #${cwp.id} is now ${sectorName}`);

    self.map = [mappingItem];

    return self.store();
  }

  static isValid(map) {
    return true;
  }

  store() {
    return db.put('map', this.map);
  }
}

export function getInstance() {
  return new Map();
}

export default {
  getInstance: getInstance,
  isValid: Map.isValid
};
