// Here we mock our database
// We use simple setters and getters
jest.mock('../src/database', () => {
  let cache = {};

  return () => {
    const api = {};
    const _ = require('lodash');

    api.get = (key) => {
      if(!cache[key]) {
        // Simulate levelup API when key is not found
        return Promise.reject({notFound: true});
      }

      return Promise.resolve(cache[key]);
    };

    api.put = (key, value) => {
      cache[key] = _.cloneDeep(value);
      return Promise.resolve();
    };

    api._setCache = (newCache) => {
      cache = _.cloneDeep(newCache);
    };

    return api;
  };
});

beforeEach(() => {
  process.env.FOURME_ENV = 'LFEE';
  delete process.env.FORCE_CLIENT_ID;
});

// Mock bunyan here
// We add a specific stream to opsLog
// We also put this stream in globals to ease access in tests
import {opsLog} from '../src/logger';
import bunyan from 'bunyan';
const ringBuffer = new bunyan.RingBuffer({limit: 20});
global.LOG_STREAM = ringBuffer;

opsLog.addStream({
  stream: ringBuffer,
  type: 'raw',
  level: 'trace',
});

// Mock socket.io here
// Socket.io doesn't work in Jest environment
// See here :
// * https://github.com/socketio/socket.io/issues/2381
//import mockIo from './mocks/socket.io';
//jest.mock('socket.io', () => mockIo());
// UPDATE : Socket.io works fine if 'jsdom' environment is set by Jest
