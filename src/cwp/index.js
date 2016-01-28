import express from 'express';
import cwpController from './controller';

/**
 * /cwps/
 */

export function getCwpRouter() {
  let router = express.Router();

  router.get('/', cwpController.getAll);
  router.get('/:cwpId([0-9]+)', cwpController.getById);

  router.get('/getMine', cwpController.getMine);

  return router;
};
