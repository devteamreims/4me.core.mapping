import bunyan from 'bunyan';

const opsLog = bunyan.createLogger({name: 'mapping-ops'});

export function logMap(map, payload) {
  return opsLog.info({
    map,
    payload,
  });

}
