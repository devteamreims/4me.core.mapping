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

      let cwpId = _.get(socket, 'handshake.query.cwp-id');

      if(cwpId !== undefined) {
        cwpId = parseInt(cwpId);
        debug(`Socket with id ${socket.id} now bound to CWP ${cwpId}`);
        // Decorate socket object with cwpId
        socket.cwpId = cwpId;
      } else {
        socket.cwpId = null;
        debug(`Socket with id ${socket.id} is an unknown CWP`);
      }
    });
  }
  return mySocketIo;
}

function emitToCwps(targetCwps, message, data) {
  if(!_.isArray(targetCwps) && targetCwps !== '*') {
    targetCwps = [parseInt(targetCwps)];
  }

  const socketToCwpId = (s) => s.cwpId;

  const socketCollection = mySocketIo.of('/').connected;

  let socketsToNotify;

  if(targetCwps === '*') {
    socketsToNotify = socketCollection;
  } else {
    socketsToNotify = _.filter(socketCollection, (s) => {
      return _.includes(targetCwps, socketToCwpId(s))
    });
  }

  let targetCwpsString;
  if(targetCwps === '*') {
    targetCwpsString = 'ALL';
  } else {
    targetCwpsString = targetCwps.join(',');
  }

  debug(`Sending ${message} to CWPs with id : ${targetCwpsString}`);
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
