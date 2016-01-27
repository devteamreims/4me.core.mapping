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

export default class Map {
  // Singleton pattern
  constructor() {
    if(!instance) {
      return this
        ._bootstrap()
        .then((self) => {
          instance = self;
          return instance;
        })
        .catch((err) => { throw new Error('Failed to bootstrap Map')});
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

    return db.get('map').then((m) => {
      self.map = m;
      return self;
    });

    return Promise.resolve(self);

  }
}

export function getInstance() {
  return new Map();
}
