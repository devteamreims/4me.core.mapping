import express from 'express';
import _ from 'lodash';

/**
 * /reload/
 */

import {
  emitToCwps,
} from '../socket';

export function getReloadRouter() {
  let router = express.Router();

  router.get('/', forceReload);

  return router;
};

function forceReload(req, res, next) {
  let cwps = '*';
  if(req.query.cwps !== undefined) {
    cwps = _(req.query.cwps)
      .map(id => parseInt(id, 10))
      .compact()
      .value();
  }

  emitToCwps(cwps, 'force_reload');

  res.send('OK');
}
