import {APPDIR} from '../settings'
import * as sectorStaticDataStub from '../stubs/sector/sectorStaticData'

const sectorBootstrap = proxyquire(APPDIR + 'sector/bootstrap', {
  '../../config/sectors': sectorStaticDataStub
}).default;

describe('sector bootstrap', () => {
  it('should be return a valid object', () => {
    sectorBootstrap().should.all.have.property('name');
    sectorBootstrap().should.all.have.property('elementarySectors');
  });

  it('should load all the sectors', () => {
    sectorBootstrap().length.should.eql(sectorStaticDataStub.default.length);
  });

});