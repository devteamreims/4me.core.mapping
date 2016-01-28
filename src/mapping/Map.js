import _ from 'lodash';
import d from 'debug';
import Promise from 'bluebird';
const debug = d('4me.mapping.Map');

import CwpTree from '../cwp/Tree';
import SectorTree from '../sector/Tree';
import database from '../database';


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
    var self = this;

    debug('Bootstraping Map');

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
      Map.validate(map);
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
    this.map = [mappingItem];

    return this.store().then(() => this);
  }

  store() {
    return db.put('map', this.map);
  }
  // Validates a map
  static validate(map) {
    // Input sanitation
    if(!_.isArray(map)) {
      throw new Error('Invalid argument');
    }

    // Validate format of each element in the array
    map.forEach((m) => {
      if(!_.isNumber(m.cwpId) || !_.isArray(m.sectors)) {
        throw new Error('Invalid argument : wrong format');
      }
    });

    // Check if every CWP exists, is the right type and is not disabled
    map.forEach((m) => {
      let cwp = cwpTree.getById(m.cwpId);

      if(!cwp) {
        throw new Error(`Trying to assign sectors to an unknown CWP (#${m.cwpId})`);
      }
      if(cwp.disabled === true) {
        throw new Error(`Trying to assign sectors to a disabled CWP (#${m.cwpId})`);
      }
      if(cwp.isCwp() !== true) {
        throw new Error(`Trying to assign sectors to a CWP with the wrong type (#${m.cwpId} / ${cwp.type})`);
      }
    });

    let boundSectors = _.flatten(map.map((m) => m.sectors)).map((s) => s.toUpperCase());
    // Check for duplicate sectors
    if(_.uniq(boundSectors).length !== boundSectors.length) {
      throw new Error(`Trying to bind sectors multiple times`);
    }
    // Check if every sector exists
    let elementarySectors = sectorTree.getElementary().map((s) => s.name.toUpperCase());

    if(_.difference(boundSectors, elementarySectors).length !== 0) {
      throw new Error('Trying to bind unknown sectors');
    }

    // Check if every sector is bound
    if(_.difference(elementarySectors, boundSectors).length !== 0) {
      throw new Error('We have missing elementary sectors !');
    }

    return true;
  }


}

export function getInstance() {
  return new Map();
}

export default {
  getInstance: getInstance,
  validate: Map.validate
};
