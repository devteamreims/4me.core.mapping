import R from 'ramda';
import d from 'debug';
const debug = d('4me.map.model');

import getDb from '../database';
const db = getDb();

import { clients, sectors } from '../env';
import { validate } from './validator';

import {
  logNewMap,
  logMapError,
} from '../logger';


// Async
export function set(map) {
  // First check wether our map is map
  try {
    validate(map);
  } catch(err) {
    // Log error
    logMapError(map, err);
    return Promise.reject(err);
  }

  return db.put('map', map)
    .then(() => {
      logNewMap(map)
      return map;
    });
}

export function get() {
  // Pull map from database
  return db.get('map')
    .catch(err => {
      // Handle 'not found' error, if not found, create basic map
      if(err.notFound) {
        debug('Data not found in the database');
        const map = generateMap();
        return db.put('map', map)
          .then(() => map);
      }
      // Let error bubble up
      throw err;
    });
}


export function generateMap() {
    debug('Generating a valid map');

    // Let's find a CWP to bind every sector
    const getCwpId = R.pipe(
      // Find a CWP
      R.find(R.propEq('type', 'cwp')),
      R.prop('id'),
    );

    const cwpId = getCwpId(clients.getClients());

    if(!cwpId) {
      return Promise.reject(new Error('Could not find a single CWP to bind sectors'));
    }

    // Find every single sector
    const elementarySectors = sectors.getElementarySectors();
    if(!elementarySectors || elementarySectors.length === 0) {
      return Promise.reject(new Error(`Could not find a single sector to bind to ${cwpId}`));
    }

    debug(`Assigning all sectors to CWP #${cwpId}`);
    debug(`CWP #${cwpId} received ${elementarySectors.length} elementary sectors`);
    // Create our single mapping item
    const map = [{
      cwpId: cwpId,
      sectors: [...elementarySectors],
    }];

    return map;
}
