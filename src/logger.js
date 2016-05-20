import bunyan from 'bunyan';

const opsLog = bunyan.createLogger({name: 'mapping-ops'});

export function logNewMap(map, payload) {
  return opsLog.info({
    map,
    payload,
  });

}

export function logMapError(map, err) {
  return opsLog.error(err, {map});
}
