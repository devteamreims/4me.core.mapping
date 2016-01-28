import {APPDIR} from '../settings';

const modulePath = APPDIR + 'cwp/identifier';

const validReq = {
  ip: '1.2.3.4'
};

const validCwpTreeData = [
  {
    id: 1,
    ipAddr: ['1.2.3.4', '2.3.4.5']
  }, {
    id: 2,
    ipAddr: ['3.4.5.6']
  }
];

const validCwpTree = {
  getAll: () => validCwpTreeData
};

describe('cwp identifier', () => {

  let cwpIdentifier;

  beforeEach(() => {
    // Import the whole module
    cwpIdentifier = proxyquire(modulePath, {});
  });

  it('should throw without valid arguments', () => {
    expect(() => cwpIdentifier.reqToCwp()).to.throws(/invalid argument/i);
    expect(() => cwpIdentifier.reqToCwp({}, {})).to.throws(/invalid argument/i);
    expect(() => cwpIdentifier.reqToCwp({ip: '1.2.3.4'}, {})).to.throws(/invalid argument/i);
  });

  it('should not throw with valid arguments', () => {
    const cwpTree = {getAll: () => []};
    expect(() => cwpIdentifier.reqToCwp({ip: '1.2.3.4'}, cwpTree)).to.not.throws();
  });

  it('should return -1 when not found', () => {
    let req = _.clone(validReq);
    req.ip = '1.1.1.1';

    cwpIdentifier.reqToCwp(req, validCwpTree).should.eql(-1);
  });

  it('should return a proper cwp id when found', () => {
    let req = _.clone(validReq);
    cwpIdentifier.reqToCwp(req, validCwpTree).should.eql(validCwpTreeData[0].id);

    req.ip = '3.4.5.6';
    cwpIdentifier.reqToCwp(req, validCwpTree).should.eql(validCwpTreeData[1].id);
  });
});
