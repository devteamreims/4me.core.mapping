import express from 'express';
import mySocket from './socket';

// import {getSectorRouter} from './sector';
// import {getCwpRouter} from './cwp';
import { getMapRouter } from './map';
//
import identify from './client_identifier';
import {getStatusRouter} from './status';
import {getReloadRouter} from './reload';

const routes = function(socketIo) {

  // Initialize our socketIo
  mySocket.init(socketIo);

  const router = express.Router();


  // router.use('/sectors', getSectorRouter());
  router.get('/identify', identify);
  router.use('/map', getMapRouter());
  router.use('/reload', getReloadRouter());

  router.use('/status', getStatusRouter());

  /*
  // Load our API
  var sectors = require('./sectors');
  var cwp = require('./cwp');

  // Load our API
  router.use('/sectors', sectors);
  router.use('/cwp', cwp);
  */

  return router;
};

export default routes;
