/*
 * Stub db wrapper
 *
 */

let api = {};

api.put = sinon.spy(function(key, value) {
  return Promise.resolve(value);
});

api.get = sinon.spy(function(key) {
  return Promise.resolve(key);
});

export default function(args) {
  return api;
};
