import {APPDIR} from '../settings'
// Stubs
import * as sectorStaticDataStub from '../stubs/sector/sectorStaticData'
import * as sectorBootstrapStub from '../stubs/sector/bootstrap';
import * as SectorStub from '../stubs/sector/Sector';

const modulePath = APPDIR + 'sector/Tree';
const moduleStubs = {
  './bootstrap': sectorBootstrapStub,
  './Sector': SectorStub
};

describe('SectorTree', function() {
  it('should instantiate', () => {
    let SectorTree = proxyquire(modulePath, moduleStubs).default;

    let sectorTree = new SectorTree();
    sectorTree.constructor.name.should.eql('SectorTree');
  });

  it('should be a singleton', () => {
    let SectorTree = proxyquire(modulePath, moduleStubs).default;

    let sectorTree = new SectorTree();
    let s = new SectorTree();
    s.should.eql(sectorTree);
  });

  describe('constructor', () => {
    it('should instantiate Sectors', () => {
      let sectorStub = sinon.spy(function() {
        return new SectorStub.default(...arguments);
      });

      let stubs = Object.assign(_.cloneDeep(moduleStubs), {
        './Sector': {
          default: sectorStub
        }
      });

      let SectorTree = proxyquire(modulePath, stubs).default;

      let sectorTree = new SectorTree();

      sectorStub.should.have.callCount(sectorBootstrapStub.default().length);

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

      let SectorTree = proxyquire(modulePath, stubs).default;

      expect(() => new SectorTree()).to.throw(/Failed loading sector tree/);
    });

    it('should populate elementary property', () => {
      let SectorTree = proxyquire(modulePath, moduleStubs).default;

      let sectorTree = new SectorTree();

      let expected = sectorBootstrapStub.default()
        .filter((s) => s.elementarySectors.length === 1)
        .length;

      sectorTree.should.have.property('elementary');
      sectorTree.elementary.length.should.eql(expected);
    });
  });

  describe('instanciated', () => {
    let sectorTree;

    beforeEach(() => {
      let SectorTree = proxyquire(modulePath, moduleStubs).default;

      sectorTree = new SectorTree();
    });

    it('should have a getTree method', () => {
      sectorTree.getTree.should.be.a('function');
    });

    it('should have a getTree method', () => {
      sectorTree.getTree.should.be.a('function');
    });
  });
});