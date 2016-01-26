/*
 * Stub db wrapper
 *
 */

let api = {};

api.put = function(key, value) {
  return Promise.resolve(value);
};

api.get = function(key) {
  return Promise.resolve(value);
};

var ex = function(args) {
  return api;
};

export default ex;