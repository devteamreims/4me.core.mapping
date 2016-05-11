import express from 'express';

import _ from 'lodash';

/**
 * /status/
 */

export function getStatusRouter() {
  let router = express.Router();

  router.get('/', getStatus);

  return router;
};

import {
  getSocket,
} from '../socket';

function getStatus(req, res, next) {
  // Send raw map object
  // Send socket clients (core)
  // Send socket clients (mapping component)

  //const rawMap = {};

  const isCoreSocket = (s) => ('cwpId' in s && s.cwpId !== null);

  const coreSockets = _(getSocket().of('/').connected)
    .map(s => {
      if(isCoreSocket(s)) {
        return {
          id: s.id,
          cwpId: s.cwpId,
          ip: s.request.connection.remoteAddress,
        };
      }
      return false;
    })
    .compact()
    .value();

  const mappingSockets = _(getSocket().of('/').connected)
    .map(s => {
      if(!isCoreSocket(s)) {
        return {
          id: s.id,
          ip: s.request.connection.remoteAddress,
        };
      }
      return false;
    })
    .compact()
    .value();

  res.send({
    //rawMap,
    coreSocketClients: coreSockets,
    mappingSocketClients: mappingSockets,
  });

}
