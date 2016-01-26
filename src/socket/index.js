"use strict";
import {default as d} from 'debug';

/**
  * Socket module
  * Simple wrapper around socket.io
  *
  */

// Load dependancies
let debug = d('4me.socket');

let mySocketIo;

function init(ioSocket) {
  debug('Initializing socket.io');

  if(ioSocket !== undefined) {
    mySocketIo = ioSocket;
  }
  if(mySocketIo !== undefined) {
    mySocketIo.on('connect', function(socket) {
      debug('Client connecting!');
      if(socket.request.cookies['my-cwp-id']) {
        debug('This is cwp with id ' + socket.request.cookies['my-cwp-id']);
      } else {
        debug('Unknown client, disconnect for now');
        socket.disconnect('unidentified');
      }
    });
  }
  return mySocketIo;
}

function getSocket() {
  return mySocketIo;
}

export default {
  init: init,
  getSocket: getSocket
};