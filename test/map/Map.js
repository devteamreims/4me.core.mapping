import {APPDIR} from '../settings'
// Stubs
import * as CwpTreeStub from '../stubs/cwp/Tree';
import * as SectorTreeStub from '../stubs/sector/Tree';
import * as dbStub from '../stubs/database';

const modulePath = APPDIR + 'mapping/Map';
const moduleStubs = {
  '../cwp/Tree': CwpTreeStub,
  '../sector/Tree': SectorTreeStub,
  '../database': dbStub
};

describe('Map', function() {
  it('should instantiate', () => {
    let Map = proxyquire(modulePath, moduleStubs);

    return Map.getInstance().then((map) => map.constructor.name.should.eql('Map'));
  });

  it('should be a singleton', () => {
    let Map = proxyquire(modulePath, moduleStubs);

    let map1, map2;

    return Map.getInstance()
      .then((m) => map1 = m)
      .then(() => Map.getInstance())
      .then((m) => map2 = m)
      .then(() => map1.should.eql(map2));
  });

  describe('constructor', () => {
    it('should have a getInstance method' , () => {
      let Map = proxyquire(modulePath, moduleStubs);

      Map.getInstance.should.be.a('function');
    });

    it('should instantiate CwpTree and SectorTree', () => {
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

      return Map.getInstance().then(() => [
        cwpStub.should.have.been.calledOnce,
        sectorStub.should.have.been.calledOnce
      ]);
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

      expect(() => proxyquire(modulePath, stubs)).to.throws();
    });

    it('should hit the database', () => {
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

      return Map.getInstance().then(() => dbStub().get.should.have.been.called);

    });

    describe('with empty db', () => {
      it('should fail if no CWP is available', () => {
        // Stub dependencies
        let r = {
          get: sinon.stub().resolves({}),
          put: sinon.stub().resolves({})
        };

        let dbStub = () => r;

        let cwpTreeStub = function() {
          return {
            getByType: () => []
          };
        };

        let stubs = Object.assign(_.cloneDeep(moduleStubs), {
          '../database': {
            default: dbStub
          },
          '../cwp/Tree': {
            default: cwpTreeStub
          }
        });

        let Map = proxyquire(modulePath, stubs);
        return Map.getInstance().then((m) => {
          return m._createEmptyMap().should.be.rejectedWith(/cwp/i);
        });
      });

      it('should fail if no sector is available', () => {
        // Stub dependencies
        let r = {
          get: sinon.stub().resolves({}),
          put: sinon.stub().resolves({})
        };

        let dbStub = () => r;

        let cwpTreeStub = function() {
          return {
            getByType: () => []
          };
        };

        let sectorTreeStub = function() {
          return {
            getElementary: () => []
          };
        };

        let stubs = Object.assign(_.cloneDeep(moduleStubs), {
          '../database': {
            default: dbStub
          },
          '../cwp/Tree': {
            default: cwpTreeStub
          },
          '../sector/Tree': {
            default: sectorTreeStub
          }
        });

        let Map = proxyquire(modulePath, stubs);
        return Map.getInstance().then((m) => {
          return m._createEmptyMap().should.be.rejectedWith(/sector/i);
        });
      });

      it('should be able to create an empty map', () => {
        // Stub dependencies
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
        return Map.getInstance().then((m) => {
          return [
            m._createEmptyMap().should.be.resolved,
            r.put.should.have.been.called
          ];
        });
      });
    });

  });

  describe('instanciated', () => {
    let map;

    beforeEach(() => {
      let Map = proxyquire(modulePath, moduleStubs);

      return Map.getInstance().then((m) => {
        map = m;
        return map;
      });
    });



  });

  describe('static methods', () => {
    let Map;
    beforeEach(() => {
      Map = proxyquire(modulePath, moduleStubs).default;
    });



    describe('validate', () => {
      it('should have a validate method', () => {
        Map.validate.should.be.a('function');
      });

      it('should refuse invalid input', () => {
        expect(() => Map.validate('string')).to.throws(/invalid argument/i);
        expect(() => Map.validate(null)).to.throws(/invalid argument/i);
      });

      it('should refuse invalid format', () => {
        let invalid = [
          {
            cwpId: 2,
            foo: 'bar'
          }, {
            foo: 'bar'
          }
        ];
        expect(() => Map.validate(invalid)).to.throws(/format/i);
      });

      it('should refuse unknown CWPs', () => {
        let invalid = [
          {
            cwpId: 65,
            sectors: ['UF', 'KF', 'KD']
          }
        ];
        expect(() => Map.validate(invalid)).to.throws(/unknown cwp/i);
      });

      it('should refuse CWPs with the wrong type', () => {
        // See test/stubs/cwpStaticData.js
        let invalid = [
          {
            cwpId: 1,
            sectors: ['UF', 'KF', 'KD']
          }
        ];
        expect(() => Map.validate(invalid)).to.throws(/wrong type/i);
      });

      it('should refuse disabled CWPs', () => {
        // See test/stubs/cwpStaticData.js
        let invalid = [
          {
            cwpId: 6,
            sectors: ['UF', 'KF', 'KD']
          }
        ];
        expect(() => Map.validate(invalid)).to.throws(/disabled/i);
      });

      it('should refuse unknown sectors', () => {
        let invalid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF', 'KD', '4M']
          }
        ];
        expect(() => Map.validate(invalid)).to.throws(/unknown sector/i);
      });

      it('should refuse sectors bound twice', () => {
        let invalid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF', 'KD']
          }, {
            cwpId: 3,
            sectors: ['UF']
          }
        ];
        expect(() => Map.validate(invalid)).to.throws(/multiple times/i);
      });

      it('should reject if a sector is missing', () => {
        let invalid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF']
          }
        ];
        expect(() => Map.validate(invalid)).to.throws(/missing/i);
      });
    });
  });
});
