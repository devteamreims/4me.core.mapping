"use strict";
/**
 * CWPs controller
 */

import d from 'debug';
import CwpTree from './Tree';
import {validTypes} from './Cwp';
import {reqToCwpId} from './identifier';

let cwpTree = new CwpTree();

let debug = d('4me.cwp.controller');

function getAll(req, res) {

  if(req.query.type) {
    return getByType(req, res);
  }

  res.send(cwpTree.getAll());
}

function getById(req, res) {
  res.send(cwpTree.getById(req.params.cwpId));
}

function getMine(req, res, next) {
  let cwpId = reqToCwpId(req, cwpTree);
  if(cwpId === -1) {
    throw new Error('Request from unknown client');
  }
  res.send(cwpTree.getById(cwpId));
}

function getByType(req, res) {
  if(!req.query.type || validTypes.indexOf(req.query.type) === -1) {
    throw new Error(`${req.query.type} is not a valid cwp type`);
  }

  res.send(cwpTree.getByType(req.query.type));
}

export default {
  getAll: getAll,
  getById: getById,
  getMine: getMine
};
