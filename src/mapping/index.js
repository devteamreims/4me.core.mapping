import express from 'express';
import mappingController from './controller';

/**
 * /cwps/
 */

export function getMappingRouter() {
  let router = express.Router();

  router.get('/', mappingController.getMap);
  router.post('/', mappingController.setMap);

  router.get('/cwp/:cwpId([0-9]+)', mappingController.getByCwpId);

  return router;
};
