import express from 'express';
import mappingController from './controller';

/**
 * /cwps/
 */

export function getMappingRouter() {
  let router = express.Router();

  router.get('/', mappingController.getMap);

  return router;
};
