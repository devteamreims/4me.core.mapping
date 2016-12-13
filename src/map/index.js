import express from 'express';
import { postMap, getMap, getById } from './controller';

/**
 * /cwps/
 */

export function getMapRouter() {
  let router = express.Router();

  router.get('/', getMap);
  router.post('/', postMap);
  router.get('/:cwpId', getById);

  return router;
};
