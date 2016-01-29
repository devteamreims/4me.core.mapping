"use strict";
/**
 * Mapping controller
 */

import d from 'debug';
const debug = d('4me.mapping.controller');

import Map from './Map';
import suggestor from './suggestor';
import CwpTree from '../cwp/Tree';
import SectorTree from '../sector/Tree';

let cwpTree = new CwpTree();
let sectorTree = new SectorTree();



function getMap(req, res, next) {

  return Map.getInstance()
    .then((map) => {
      return res.send(map.map);
    })
    .catch((err) => {
      debug(err);
      next(err);
    });
}

function setMap(req, res, next) {
  return Map.getInstance()
    .then((map) => {
      try {
        return map.set(req.body).then(() => res.send(map.map));
      } catch(err) {
        throw err;
      }
    })
    .catch((err) => {
      debug(err);
      next(err);
    });
}

function getByCwpId(req, res, next) {
  return Map.getInstance()
    .then((map) => {
      let mySectors = map.map.find((m) => m.cwpId === parseInt(req.params.cwpId));
      if(!mySectors) {
        res.send({
          cwpId: req.params.cwpId,
          sectors: []
        });
      }
      else {
        res.send(mySectors);
      }
    })
    .catch((err) => {
      debug(err);
      next(err);
    });
}

function getSuggestions(req, res, next) {
  return Map.getInstance()
    .then((map) => {
      try {
        res.send(suggestor(req.params.cwpId, cwpTree, sectorTree, map));
      } catch(err) {
        throw err;
      }
    })
    .catch((err) => {
      debug(err);
      next(err);
    });
}


export default {
  getMap: getMap,
  getByCwpId: getByCwpId,
  setMap: setMap,
  getSuggestions: getSuggestions
};
