"use strict";
/**
 * Mapping controller
 */

import d from 'debug';
import Map from './Map';

let debug = d('4me.mapping.controller');

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
        Map.validate(req.body);
        map.map = req.body; // TODO : Refactor
        return map.store().then(() => res.send(map.map));
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


export default {
  getMap: getMap,
  getByCwpId: getByCwpId,
  setMap: setMap
};
