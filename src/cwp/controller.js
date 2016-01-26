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
  console.log(req.params.cwpId);
  res.send(cwpTree.getById(req.params.cwpId));
}

export default {
  getAll: getAll,
  getById: getById
};