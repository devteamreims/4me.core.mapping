import bunyan from 'bunyan';


export const opsLog = bunyan.createLogger({
  name: 'mapping-ops',
  streams: [
    {
      level: process.env.NODE_ENV === 'test' ? bunyan.FATAL + 1 : 'info',
      stream: process.stdout,
    }
  ],
});

export function logMappingClientConnect(payload = {}) {
  return opsLog.info({
    payload,
  }, 'mapping socket client connected');
}

export function logCoreClientConnect(cwpId, payload = {}) {
  return opsLog.info({
    cwpId,
    payload,
  }, 'core socket client connected');
}

export function logMappingClientDisconnect(payload = {}) {
  return opsLog.info({
    payload,
  }, 'mapping socket client disconnected');
}

export function logCoreClientDisconnect(cwpId, payload = {}) {
  return opsLog.info({
    cwpId,
    payload,
  }, 'core socket client disconnected');
}

export function logNewMap(map, payload) {
  return opsLog.info({
    map,
    payload,
  });

}

export function logMapError(map, err) {
  return opsLog.error(err, {map});
}
