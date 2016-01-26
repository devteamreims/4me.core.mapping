import express from 'express';
import cwpController from './controller';

/**
 * /cwps/
 */

export function getCwpRouter() {
  let router = express.Router();

  router.get('/', cwpController.getAll);
  router.get('/:cwpId', cwpController.getById);

  return router;
};