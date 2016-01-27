import {APPDIR} from '../settings'
// Stubs
import * as cwpStaticDataStub from '../stubs/cwp/cwpStaticData'
import * as cwpBootstrapStub from '../stubs/cwp/bootstrap';
import * as CwpStub from '../stubs/cwp/Cwp';

const modulePath = APPDIR + 'cwp/Tree';
const moduleStubs = {
  './bootstrap': cwpBootstrapStub,
  './Cwp': CwpStub
};

describe('CwpTree', function() {
  it('should instantiate', () => {
    let CwpTree = proxyquire(modulePath, moduleStubs).default;

    let cwpTree = new CwpTree();
    cwpTree.constructor.name.should.eql('CwpTree');
  });

  it('should be a singleton', () => {
    let CwpTree = proxyquire(modulePath, moduleStubs).default;

    let cwpTree = new CwpTree();
    let s = new CwpTree();
    s.should.eql(cwpTree);
  });

  describe('constructor', () => {
    it('should instantiate Sectors', () => {
      let cwpStub = sinon.spy(function() {
        return new CwpStub.default(...arguments);
      });

      let stubs = Object.assign(_.cloneDeep(moduleStubs), {
        './Cwp': {
          default: cwpStub
        }
      });

      let CwpTree = proxyquire(modulePath, stubs).default;

      let cwpTree = new CwpTree();

      cwpStub.should.have.callCount(cwpBootstrapStub.default().length);

    });

    it('should throw with a failed bootstrap', () => {
      let bootstrapStub = sinon.spy(function() {
        return null;
      });

      let stubs = Object.assign(_.cloneDeep(moduleStubs), {
        './bootstrap': {
          default: bootstrapStub
        }
      });

      let CwpTree = proxyquire(modulePath, stubs).default;

      expect(() => new CwpTree()).to.throw(/Failed to load/i);
    });
  });

  describe('instanciated', () => {
    let cwpTree;

    beforeEach(() => {
      let CwpTree = proxyquire(modulePath, moduleStubs).default;

      cwpTree = new CwpTree();
    });

    it('should have a getAll method', () => {
      cwpTree.getAll.should.be.a('function');
    });

    it('should have a getById method', () => {
      cwpTree.getById.should.be.a('function');
    });

    it('should have a getByType method', () => {
      cwpTree.getByType.should.be.a('function');
    });
  });
});
