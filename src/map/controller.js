/**
 * Map controller
 */
import R from 'ramda';
import d from 'debug';
const debug = d('4me.mapping.controller');

import { get, set } from './model';
import { getSocket } from '../socket';
import { clients } from '../env';
import { getChangedClientIds } from './notifier';

export function getMap(req, res, next) {
  return get().then(map => res.send(map));
}

export function postMap(req, res, next) {
  const map = req.body;

  return set(map)
    .then(
      map => {
        const socket = getSocket();
        if(socket && socket.emit) {
          socket.emit('map_updated', map);
          socket.emit('mapping:refresh');
        }
        res.send(map);
      },
      err => next(err),
    );
}

export function getById(req, res, next) {
  const { cwpId } = req.params;
  const client = clients.getClientById(parseInt(cwpId, 10));

  if(!client || client.type !== 'cwp') {
    return res.sendStatus(404);
  }

  return get().then(
    map => {
      const sectors = R.pipe(
        R.find(R.propEq('cwpId', client.id)),
        R.propOr([], 'sectors'),
      )(map);

      return res.send({
        cwpId: client.id,
        sectors,
      });
    }
  );
}
