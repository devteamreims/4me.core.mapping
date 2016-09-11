// Here we mock our database
// We use knex and mock-knex to have the same interface
import mockIo from './mocks/socket.io';

// Socket.io doesn't work in Jest environment
// See here :
// * https://github.com/socketio/socket.io/issues/2381
jest.mock('socket.io', () => mockIo());
