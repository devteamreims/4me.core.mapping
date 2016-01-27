/*
 * Wrapper for LevelDB
 *
 */

import _ from 'lodash';
import levelup from 'level';
import LevelPromise from 'level-promise';
import d from 'debug';
const debug = d('4me.database');

let db;

let api = {};

api.put = function(key, value) {
  debug('Storing ' + key + ' with value :');
  debug(value);
  return db.put(key, value);
};

api.get = function(key) {
  debug('Getting key ' + key);
  return db.get(key);
};

export default function(args) {
  var defaults = {
    file: __dirname + '/../db.up'
  };
  var conf = defaults;
  if(args !== undefined && args.file !== undefined) {
    conf.file = args.file;
  }
  db = LevelPromise(levelup(conf.file, {valueEncoding: 'json'}));
  return api;
}
