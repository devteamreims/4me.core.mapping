"use strict";
import d from 'debug';
const debug = d('4me.socket');
import _ from 'lodash';

import {
  reqToCwpId,
} from '../cwp/identifier';


let mySocketIo;

function init(ioSocket) {
  debug('Initializing socket.io');

  if(ioSocket !== undefined) {
    mySocketIo = ioSocket;
  }
  if(mySocketIo !== undefined) {
    mySocketIo.on('connect', function(socket) {
      let cwpId = _.get(socket, 'handshake.query.cwp-id') || _.get(socket, 'request.cookies.my-cwp-id');
      if(cwpId !== undefined) {
        cwpId = parseInt(cwpId);
        debug(`Socket with id ${socket.id} now bound to CWP ${cwpId}`);
        // Decorate socket object with cwpId
        socket.cwpId = cwpId;
      } else {
        debug('Unknown client, disconnect for now');
        socket.disconnect('unidentified');
      }
    });
  }
  return mySocketIo;
}

function emitToCwps(cwps, message, data) {
  if(!_.isArray(cwps)) {
    cwps = [parseInt(cwps)];
  }

  const socketToCwpId = (s) => s.cwpId;
  const socketCollection = mySocketIo.of('/').connected;
  const socketsToNotify = _.filter(socketCollection, (s) => {
    return _.includes(cwps, socketToCwpId(s))
  });

  debug(`Sending ${message} to CWPs with id : ${cwps.join(',')}`);
  debug(`Notifying ${socketsToNotify.length} CWPs via WebSocket`);

  _.each(socketsToNotify, (s) => s.emit(message, data));

}

function getSocket() {
  return mySocketIo;
}

export default {
  init: init,
  getSocket: getSocket,
  emitToCwps: emitToCwps
};
