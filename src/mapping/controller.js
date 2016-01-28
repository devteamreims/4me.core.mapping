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

function setMap(req, res) {
  res.send({});
  return;
}

function getByCwpId(req, res, next) {
  debug(req.params.cwpId);
  res.send({
    cwpId: req.params.cwpId,
    sectors: ['UR', 'XR']
  });
}


export default {
  getMap: getMap,
  getByCwpId: getByCwpId,
  setMap: setMap
};
