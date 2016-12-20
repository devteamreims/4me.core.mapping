import app from '../../../index';
import request from 'supertest';
import io from 'socket.io-client';
import _ from 'lodash';


describe('E3.4 : must log client connects and disconnects', () => {
  beforeEach(() => {
    // Have socket.io listen
    app.io.listen(5678);
  });

  test('produce log on mapping client connect and disconnect', () => {
    const promise = new Promise((resolve, reject) => {
      const socket = io.connect('http://localhost:5678');
      socket.on('connect', () => {
        const logRecord = _.last(_.get(global, 'LOG_STREAM.records'));
        expect(logRecord.msg).toMatch(/client connected/);
        expect(logRecord.msg).toMatch(/mapping/);
        // Now disconnect client
        socket.disconnect();
      });

      socket.on('disconnect', () => {
        // This setTimeout is here to allow event propagation on the server
        setTimeout(() => {
          const logRecord = _.last(_.get(global, 'LOG_STREAM.records'));
          expect(logRecord.msg).toMatch(/client disconnected/);
          expect(logRecord.msg).toMatch(/mapping/);
          resolve()
        }, 100);
      })

      socket.on('error', err => {
        console.log('Error !');
        reject(err);
      });
    });

    return promise;
  });

  test('produce log on core client connect and disconnect', () => {
    const promise = new Promise((resolve, reject) => {
      const socket = io.connect('http://localhost:5678', {query: 'client-id=1'});
      socket.on('connect', () => {
        const logRecord = _.last(_.get(global, 'LOG_STREAM.records'));
        expect(logRecord.msg).toMatch(/client connected/);
        expect(logRecord.msg).toMatch(/core/);
        // Now disconnect client
        socket.disconnect();
      });

      socket.on('disconnect', () => {
        // This setTimeout is here to allow event propagation on the server
        setTimeout(() => {
          const logRecord = _.last(_.get(global, 'LOG_STREAM.records'));
          expect(logRecord.msg).toMatch(/client disconnected/);
          expect(logRecord.msg).toMatch(/core/);
          resolve();
        }, 100);
      })

      socket.on('error', err => {
        console.log('Error !');
        reject(err);
      });
    });

    return promise;
  });

  afterEach(() => {
    app.io.httpServer.close();
  });

});
