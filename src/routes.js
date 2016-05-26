import express from 'express';
import mySocket from './socket';

import {getSectorRouter} from './sector';
import {getCwpRouter} from './cwp';
import {getMappingRouter} from './mapping';
import {getStatusRouter} from './status';
import {getReloadRouter} from './reload';

let routes = function(socketIo) {

  // Initialize our socketIo
  mySocket.init(socketIo);

  let router = express.Router();


  router.use('/sectors', getSectorRouter());
  router.use('/cwp', getCwpRouter());
  router.use('/mapping', getMappingRouter());
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
