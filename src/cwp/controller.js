"use strict";
/**
 * CWPs controller
 */

import d from 'debug';
import CwpTree from './Tree';

let cwpTree = new CwpTree();

let debug = d('4me.cwp.controller');

function getAll(req, res) {
  res.send(cwpTree.getAll());
}

function getById(req, res) {
  if(!(let r = cwpTree.getById(req.params.cwpId)))
  res.send(cwpTree.getById(req.params.cwpId));
}

function getMine(req, res) {
  res.send(cwpTree.getById(22));
}

export default {
  getAll: getAll,
  getById: getById,
  getMine: getMine
};