import _ from 'lodash';
import R from 'ramda';
import d from 'debug';
const debug = d('4me.mapping.notifier');
import invariant from 'invariant';

import validate from './validator';

import mySocket from '../socket';

export function getChangedClientIds(oldMap, newMap) {

  // `validate` will throw is the map is invalid
  // Wrap it under R.tryCatch to make it a real function returning a boolean
  // :: Map => boolean
  const isMapLike = R.tryCatch(validate, R.F);

  invariant(
    oldMap &&
    Array.isArray(oldMap) &&
    isMapLike(oldMap),
    'Invalid argument: oldMap is not a valid map',
  );

  invariant(
    newMap &&
    Array.isArray(newMap) &&
    isMapLike(newMap),
    'Invalid argument: newMap is not a valid map',
  );

  // Compare two map items
  // :: (MapItem, MapItem) => boolean
  const areEquals = (x, y) => {
    // One of the two items is null-like
    if(!x || !y) {
      // If the two are null-like, return true
      // If only one is, return false
      return x === y;
    }

    const getSectors = R.propOr([], 'sectors');
    const isDisabled = R.propOr(false, 'disabled');
    const haveSameSectors = (x, y) => R.isEmpty(R.symmetricDifference(getSectors(x), getSectors(y)));

    return haveSameSectors(x, y) && (isDisabled(x) === isDisabled(y));
  };

  // :: MapItem => [CwpId]
  const getReferencedCwpIdsInMap = R.map(R.prop('cwpId'));

  // :: (MapItem, MapItem) => [CwpId]
  const getAllReferencedCwpIds = (oldMap, newMap) => R.union(getReferencedCwpIdsInMap(oldMap), getReferencedCwpIdsInMap(newMap));

  // :: Map => CwpId => ?MapItem
  const getByCwpId = map => cwpId => R.find(R.propEq('cwpId', cwpId), map);

  // :: (Map, Map) => CwpId => boolean
  const areEqualsById = (oldMap, newMap) => R.pipe(
    cwpId => [getByCwpId(oldMap)(cwpId), getByCwpId(newMap)(cwpId)],
    ([x, y]) => areEquals(x, y),
  );

  // List all affected CWPs
  const getChangedCwpIds = (oldMap, newMap) => {
    const referencedIds = getAllReferencedCwpIds(oldMap, newMap);
    return R.reject(areEqualsById(oldMap, newMap), referencedIds);
  };

  return getChangedCwpIds(oldMap, newMap);
}

const getSectors = (cwpId, map) => {
  return _.get(_.find(map, (m) => cwpId === m.cwpId), 'sectors', []).sort();
}
