import _ from 'lodash';
import R from 'ramda';
import d from 'debug';

const debug = d('4me.mapping.validator');

import { clients, sectors } from '../env';

  // Validates a map
export function validate(map) {
  // Input sanitation
  if(!_.isArray(map)) {
    throw new Error('Invalid argument');
  }

  // Validate format of each element in the array
  let mentionnedClientIds = [];
  let mentionnedSectors = [];
  map.forEach((m) => {
    const isValid = m.cwpId && (_.isArray(m.sectors) || !!m.disabled);
    if(!isValid) {
      throw new Error('Invalid argument : wrong format');
    }

    // Check if every CWP exists, is the right type and is not disabled
    const client = clients.getClientById(m.cwpId);

    if(!client) {
      throw new Error(`Trying to assign sectors to an unknown CWP (#${m.cwpId})`);
    }

    if(client.type !== 'cwp') {
      throw new Error(`Map should not reference clients with a non-CWP type (#${m.cwpId} / ${client.type})`);
    }

    if(m.disabled === true && m.sectors && m.sectors.length > 0) {
      throw new Error(`Trying to assign sectors to a disabled CWP (#${m.cwpId})`);
    }

    // Check for duplicate declarations of a specific CWP
    if(mentionnedClientIds.includes(m.cwpId)) {
      throw new Error(`Map should not reference a client multiple times (#${m.cwpId})`);
    }

    mentionnedClientIds.push(m.cwpId);

    // If we don't have sectors set for this particular item, break the loop and move to the next item
    if(!m.sectors) {
      return;
    }

    const areInEnvironment = R.all(R.contains(R.__, sectors.getElementarySectors()));
    if(!areInEnvironment(m.sectors)) {
      throw new Error(`Trying to bind unknown sectors (#${m.cwpId})`);
    }

    const containsDuplicateSectors = R.pipe(
      R.intersection(mentionnedSectors),
      R.isEmpty,
      R.not,
    );

    if(containsDuplicateSectors(m.sectors)) {
      throw new Error(`Trying to bind sectors multiple times (#${m.cwpId})`);
    }

    mentionnedSectors = mentionnedSectors.concat(m.sectors);

  });

  // Finally we check we have all elementary sectors bound somewhere
  // :: (mentionedSectors, allSectors) => missingSectors
  const getMissingSectors = R.without;
  // :: (mentionnedSectors, allSectors) => boolean
  const containsMissingSectors = R.pipe(
    getMissingSectors,
    R.isEmpty,
    R.not,
  );

  // Check if every sector is bound
  if(containsMissingSectors(mentionnedSectors, sectors.getElementarySectors())) {
    const missingSectors = getMissingSectors(mentionnedSectors, sectors.getElementarySectors());
    throw new Error(`Sectors are missing from the map (${missingSectors.join(',')})`);
  }

  return true;
}

export default validate;
