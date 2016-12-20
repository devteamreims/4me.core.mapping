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

  const isCoreSocket = (s) => ('clientId' in s && s.clientId !== null);

  const coreSockets = _(getSocket().of('/').connected)
    .map(s => {
      if(isCoreSocket(s)) {
        const ipAddress = s.request.headers['x-forwarded-for'] || s.request.connection.remoteAddress;
        return {
          id: s.id,
          clientId: s.clientId,
          ip: ipAddress,
        };
      }
      return false;
    })
    .compact()
    .value();

  const mappingSockets = _(getSocket().of('/').connected)
    .map(s => {
      const ipAddress = s.request.headers['x-forwarded-for'] || s.request.connection.remoteAddress;
      if(!isCoreSocket(s)) {
        return {
          id: s.id,
          ip: ipAddress,
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
    version: process.env.npm_package_version,
  });

}
