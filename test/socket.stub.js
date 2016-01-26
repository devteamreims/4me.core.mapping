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

export default {
  getSocket: getSocket
};
