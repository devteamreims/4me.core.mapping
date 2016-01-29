import {APPDIR} from '../settings'
// Stubs
import * as CwpTreeStub from '../stubs/cwp/Tree';
import * as SectorTreeStub from '../stubs/sector/Tree';
import * as MapStub from '../stubs/mapping/Map';

const modulePath = APPDIR + 'mapping/suggestor';
const moduleStubs = {};

let cwpTree = new CwpTreeStub.default();
let sectorTree = new SectorTreeStub.default();
let map = new MapStub.default();

describe('suggestor', () => {
  
  it('should load', () => {
    let suggestor = proxyquire(modulePath, moduleStubs).default;
    suggestor.should.be.a('function');
  });

  describe('loaded', () => {
    let suggestor;
    beforeEach(() => {
      suggestor = proxyquire(modulePath, moduleStubs).default;
    });

    it('should refuse invalid input', () => {
      expect(() => suggestor(4, null, sectorTree, map)).to.throws(/invalid argument/i);
      expect(() => suggestor(4, cwpTree, null, map)).to.throws(/invalid argument/i);
      expect(() => suggestor('string', cwpTree, sectorTree, map)).to.throws(/invalid argument/i);
      expect(() => suggestor(null, cwpTree, sectorTree, map)).to.throws(/invalid argument/i);
    });

    it('should reject unknown cwps', () => {
      expect(() => suggestor(123456, cwpTree, sectorTree, map)).to.throws(/unknown cwp/i);
    });

    it('should reject non standard CWPs', () => {
      expect(() => suggestor(1, cwpTree, sectorTree, map)).to.throws(/type/i);
    });

    describe('on CWP with sectors bound', () => {
      let cwpId = 4;
      // cwp #4 has KD bound
      it('should return canAccept sectors', () => {
        const result = [
          {sectors: ['UF', 'KF'].sort()},
          {sectors: ['KF'].sort()}
        ];
        suggestor(4, cwpTree, sectorTree, map).should.deep.eql(result);
      });
    });
  });
});