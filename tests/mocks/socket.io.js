

export default function mockIo() {
  const mockServer = require('mock-socket.io').Server;
  return () => {
    const r = new mockServer();
    r.use = () => {};
    return r;
  };
}
