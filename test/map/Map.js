import {APPDIR} from '../settings'
// Stubs
import * as CwpTreeStub from '../stubs/cwp/Tree';
import * as SectorTreeStub from '../stubs/cwp/Tree';
import * as dbStub from '../stubs/database';

const modulePath = APPDIR + 'mapping/Map';
const moduleStubs = {
  '../cwp/Tree': CwpTreeStub,
  '../sector/Tree': SectorTreeStub,
  '../database': dbStub
};

describe('Map', function() {
  it('should instantiate', (done) => {
    let Map = proxyquire(modulePath, moduleStubs);

    Map.getInstance().then((map) => {
      map.constructor.name.should.eql('Map');
      done();
    })
    .catch(() => {
      (true).should.eql(false);
      done();
    });
  });

  it('should be a singleton', (done) => {
    let Map = proxyquire(modulePath, moduleStubs);

    let map1, map2;

    Map.getInstance()
    .then((m) => map1 = m)
    .then(() => Map.getInstance())
    .then((m) => map2 = m)
    .then(() => {
      map1.should.eql(map2);
      done();
    })
    .catch(() => {
      (true).should.eql(false);
      done();
    });
  });

  describe('constructor', () => {
    it('should have a getInstance method' , () => {
      let Map = proxyquire(modulePath, moduleStubs);

      Map.getInstance.should.be.a('function');
    });

    it('should instantiate CwpTree and SectorTree', (done) => {
      let cwpStub = sinon.spy(function() {
        return new CwpTreeStub.default(...arguments);
      });

      let sectorStub = sinon.spy(function() {
        return new SectorTreeStub.default(...arguments);
      });

      let stubs = Object.assign(_.cloneDeep(moduleStubs), {
        '../cwp/Tree': {
          default: cwpStub
        },
        '../sector/Tree': {
          default: sectorStub
        }
      });

      let Map = proxyquire(modulePath, stubs);

      Map.getInstance().then(() => {
        cwpStub.should.have.been.calledOnce;
        sectorStub.should.have.been.calledOnce;
        done();
      });
    });

    it('should throw with a failed bootstrap', () => {
      let cwpStub = sinon.spy(function() {
        throw new Error('Foo bar');
      });

      let stubs = Object.assign(_.cloneDeep(moduleStubs), {
        '../cwp/Tree': {
          default: cwpStub
        }
      });

      let Map = proxyquire(modulePath, stubs);

      Map.getInstance().should.eventually.be.rejected;
    });

    it('should hit the database', (done) => {
      let r = {
        get: sinon.stub().resolves({}),
        put: sinon.stub().resolves({})
      };
      let dbStub = () => r;

      let stubs = Object.assign(_.cloneDeep(moduleStubs), {
        '../database': {
          default: dbStub
        }
      });

      let Map = proxyquire(modulePath, stubs);

      Map.getInstance().then(() => {
        dbStub().get.should.have.been.called;
        done();
      });
    });
  });

  describe('instanciated', () => {
    let map;

    beforeEach((done) => {
      let Map = proxyquire(modulePath, moduleStubs);

      map = Map.getInstance().then(() => done());
    });

  });
});
