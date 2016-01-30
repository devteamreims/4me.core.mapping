/**
 * Socket.io stub
 *
 */

let mySocketIo;

function getSocket() {
  return {
    emit: function() {},
    on: function() {}
  };
}

function init() {}

function emitToCwps() {}

export default {
  getSocket: getSocket,
  init: init,
  emitToCwps: sinon.stub().returns(true)
};
