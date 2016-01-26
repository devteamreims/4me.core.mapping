"use strict";
/**
 * Sectors controller
 */

import d from 'debug';
import SectorTree from './Tree';

let sectorTree = new SectorTree();

let debug = d('4me.sectors.controller');

function elementary(req, res) {
  res.send(sectorTree.getElementary());
}

function tree(req, res) {
  res.send(sectorTree.getTree());  
}

function suggest(req, res) {
  var cwpId = req.params.cwpId;
  res.send({});
}

function getGrouping(req, res) {
  var elemSect = req.body.elementarySectors;
  res.send({});
}

export default {
  elementary: elementary,
  tree: tree,
  suggest: suggest,
  getGrouping: getGrouping
};