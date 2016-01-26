import express from 'express';
import sectorController from './controller';

/**
 * /sectors/
 */

export function getSectorRouter() {
  let router = express.Router();

  router.get('/', sectorController.tree);
  router.get('/elementary', sectorController.elementary);

  return router;
};