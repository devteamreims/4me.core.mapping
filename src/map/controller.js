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

  return get()
    .then(oldMap =>
      set(map)
        .then(newMap => ({
          newMap,
          oldMap,
        }))
    )
    .then(
      ({oldMap, newMap}) => {
        const socket = getSocket();
        if(socket && socket.emit) {
          // Emit the new map via socket
          socket.emit('map_updated', newMap);
          // Notify changed cwps that their sectors have changed
          const changedClients = getChangedClientIds(oldMap, newMap);
          socket.emit('clients_changed', changedClients);
        }
        res.send(newMap);
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
