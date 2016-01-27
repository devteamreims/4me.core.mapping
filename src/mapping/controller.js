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
;
}


export default {
  getMap: getMap
};
