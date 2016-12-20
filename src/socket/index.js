import d from 'debug';
const debug = d('4me.socket');
import _ from 'lodash';

import {
  logMappingClientConnect,
  logCoreClientConnect,
  logMappingClientDisconnect,
  logCoreClientDisconnect,
} from '../logger';


let mySocketIo;

function init(ioSocket) {
  debug('Initializing socket.io');

  if(ioSocket !== undefined) {
    mySocketIo = ioSocket;
  }
  if(mySocketIo !== undefined) {
    mySocketIo.on('connect', function(socket) {

      const clientId = parseInt(_.get(socket, 'handshake.query.client-id'), 10);

      const ipAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

      if(clientId) {
        debug(`Socket with id ${socket.id} now bound to 4ME Client ${clientId}`);
        // Decorate socket object with
        socket.clientId = clientId;
        logCoreClientConnect(clientId, {ipAddress});
      } else {
        socket.clientId = null;
        debug(`Socket with id ${socket.id} is an unknown CWP`);
        logMappingClientConnect({ipAddress});
      }

      socket.on('disconnect', () => {
        if(socket.clientId) {
          logCoreClientDisconnect(socket.clientId);
        } else {
          logMappingClientDisconnect();
        }
      });


    });
  }
  return mySocketIo;
}

export function emitToCwps(targetCwps, message, data) {
  if(!_.isArray(targetCwps) && targetCwps !== '*') {
    targetCwps = [parseInt(targetCwps)];
  }

  const socketToCwpId = (s) => s.clientId;

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

export function getSocket() {
  return mySocketIo;
}

export default {
  init: init,
  getSocket: getSocket,
  emitToCwps: emitToCwps
};
