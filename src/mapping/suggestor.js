import _ from 'lodash';
import d from 'debug';
import Promise from 'bluebird';
const debug = d('4me.mapping.suggestor');

export default function(cwpId, cwpTree, sectorTree, map) {
  if(!parseInt(cwpId) || !cwpTree || !sectorTree || !map) {
    throw new Error('Invalid argument');
  }

  let cwp = cwpTree.getById(parseInt(cwpId));

  if(!cwp) {
    throw new Error(`Unknown cwp with id ${cwpId}`);
  }

  if(!cwp.isCwp()) {
    throw new Error(`Cannot suggest sectors to a CWP with type ${cwp.type}`)
  }

  let sectorCwpBond = map.get().find((m) => {
    return m.cwpId === parseInt(cwpId) && !_.isEmpty(m.sectors);
  });

  if(sectorCwpBond === undefined) {
    return _suggestOnEmptyCwp(cwp, cwpTree, sectorTree, map);
  } else {
    return _suggestOnBoundCwp(sectorCwpBond, sectorTree);
  }

};

function _suggestOnEmptyCwp(cwp, cwpTree, sectorTree, map) {
  debug(`Suggesting sectors on CWP ${cwp.id}`);

  // First we need to find canGive from our map
  let rawSuggestions = [];
  map.get().forEach((m) => {
    if(_.isEmpty(m.sectors)) {
      // No sectors bound, nothing to give
      return true;
    }

    // Find CWP
    let cwp = cwpTree.getById(m.cwpId);
    if(!cwp) {
      debug('This should not happen, we have an unknown CWP in our map');
      return true;
    }


    // Find sector group
    let sector = sectorTree.getFromElementary(m.sectors);
    if(!sector || _.isEmpty(sector)) {
      // Unknown sector bound, move on
      return true;
    }

    // Add bound sector to rawSuggestions, useful for moving sector groups
    rawSuggestions.push(sector.name);

    if(_.isEmpty(sector.canGive)) {
      // Nothing to give, move on
      return true;
    }

    // Add canGive
    rawSuggestions = rawSuggestions.concat(sector.canGive);

  });

  debug('Found everything the room had to give');

  // Expand rawSuggestions, filter unknown stuff
  rawSuggestions = _.compact(
    rawSuggestions
      .map((r) => sectorTree.getSector(r))
  );

  // Now that we have raw suggestions, we must filter them
  // Build our filter
  let elementarySectorsFilter = [];
  if(!_.isEmpty(cwp.suggestions.filteredSectors)) {
    elementarySectorsFilter = _.compact(_.flatten(
      cwp.suggestions.filteredSectors
        .map(fs => _.get(sectorTree.getSector(fs), 'elementarySectors', []))
    ));
  }

  // elementarySectorsFilter is an array of elementarySectors we need to filter out suggestions
  let filtered = rawSuggestions.filter((r) => {
    // Here we assess the presence of a member of the filter in our suggestion
    return _.isEmpty(_.intersection(r.elementarySectors, elementarySectorsFilter));
  });

  // Now that we have filtered suggestions, we need to sort them
  // First, sort by alphabetical order
  let sorted = filtered.sort();


  // Expand preferenceOrder
  let expandedPreferenceOrder = _.map(cwp.suggestions.preferenceOrder, (p) => sectorTree.getSector(p));

  // Sort using preferenceOrder
  sorted = _.sortBy(filtered, (suggestion) => _rateSuggestion(expandedPreferenceOrder, suggestion.elementarySectors)).reverse();

  return sorted.map((r) => {
    return {
      sectors: r.elementarySectors
    };
  });
}

// This util function rates a suggestion
function _rateSuggestion(preferenceOrder, suggestionSectors) {
  if(!_.isArray(preferenceOrder) || !_.isArray(suggestionSectors)) {
    throw new Error('Argument error');
  }

  let score = preferenceOrder.length;

  // We start with a maximum score
  // We loop through preferenceOrder
  _.each(preferenceOrder, (pref) => {
    // If our suggestion is included in current item of preferenceOrder,
    // we break the loop and stop decreasing score
    let commonSectors = _.intersection(pref.elementarySectors, suggestionSectors);
    if(_.isEqual(commonSectors.sort(), suggestionSectors.sort())) {
      // Here, we just confirmed our proposed suggestion is included in preferenceOrder
      return false;
    }
    score--;
  });

  return score;
}

function _suggestOnBoundCwp(sectorCwpBond, sectorTree) {
  debug(`Suggesting sectors on bond CWP ${sectorCwpBond.cwpId}`);
  let grouping = sectorTree.getFromElementary(sectorCwpBond.sectors);
  if(_.isEmpty(grouping.canAccept)) {
    debug('Sectors bound to CWP not found !');
    return [];
  }
  // canAccept : ['2F', 'KF']
  // Output [{sectors: [2F's elementarySectors]}, {sectors: [KF's elementarySectors]}]
  return grouping.canAccept.map((sectorName) => ({sectors: sectorTree.getSector(sectorName).elementarySectors}));
}
