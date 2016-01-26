import {APPDIR} from '../settings'
import * as cwpStaticDataStub from '../stubs/cwp/cwpStaticData'

const cwpBootstrap = proxyquire(APPDIR + 'cwp/bootstrap', {
  '../../config/cwps': cwpStaticDataStub
}).default;

describe('cwp bootstrap', () => {
  it('should be return a valid object', () => {
    cwpBootstrap().should.all.have.property('id');
  });

  it('should load all CWPs', () => {
    cwpBootstrap().length.should.eql(cwpStaticDataStub.default.length);
  });

});