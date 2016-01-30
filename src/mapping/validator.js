import _ from 'lodash';
import d from 'debug';
import Promise from 'bluebird';
const debug = d('4me.mapping.validator');


  // Validates a map
export function validate(map, cwpTree, sectorTree) {
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

    // No sector assigned to this CWP
    if(_.isEmpty(m.sectors)) {
      return;
    }

    if(cwp.disabled === true) {
      throw new Error(`Trying to assign sectors to a disabled CWP (#${m.cwpId})`);
    }
    if(cwp.isCwp() !== true) {
      throw new Error(`Trying to assign sectors to a CWP with the wrong type (#${m.cwpId} / ${cwp.type})`);
    }
  });

  // Check for CWPs mentionned twice or more
  let cwpIds = _.map(map, (m) => m.cwpId);
  if(!_.eq(cwpIds, _.uniq(cwpIds))) {
    throw new Error(`Trying to bind sectors to a CWP multiple times`);
  }

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

export default {
  validate: validate
};