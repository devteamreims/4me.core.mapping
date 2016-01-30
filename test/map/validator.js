import {APPDIR} from '../settings'
// Stubs
import * as CwpTreeStub from '../stubs/cwp/Tree';
import * as SectorTreeStub from '../stubs/sector/Tree';

const modulePath = APPDIR + 'mapping/validator';
const moduleStubs = {};

let cwpTree = new CwpTreeStub.default();
let sectorTree = new SectorTreeStub.default();

describe('mapValidator', () => {
  it('should load', () => {
    let mapValidator = proxyquire(modulePath, moduleStubs).default;
  });

  describe('validator', () => {
    let validator;
    beforeEach(() => {
      validator = proxyquire(modulePath, moduleStubs).default;
    });

    describe('validate', () => {
      it('should have a validate method', () => {
        validator.validate.should.be.a('function');
      });

      it('should refuse invalid input', () => {
        expect(() => validator.validate('string', cwpTree, sectorTree)).to.throws(/invalid argument/i);
        expect(() => validator.validate(null, cwpTree, sectorTree)).to.throws(/invalid argument/i);
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
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/format/i);
      });

      it('should refuse unknown CWPs', () => {
        let invalid = [
          {
            cwpId: 65,
            sectors: ['UF', 'KF', 'KD']
          }
        ];
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/unknown cwp/i);
      });

      it('should refuse CWPs with the wrong type', () => {
        // See test/stubs/cwpStaticData.js
        let invalid = [
          {
            cwpId: 1,
            sectors: ['UF', 'KF', 'KD']
          }
        ];
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/wrong type/i);
      });

      it('should refuse disabled CWPs', () => {
        // See test/stubs/cwpStaticData.js
        let invalid = [
          {
            cwpId: 6,
            sectors: ['UF', 'KF', 'KD']
          }
        ];
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/disabled/i);
      });

      it('should refuse unknown sectors', () => {
        let invalid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF', 'KD', '4M']
          }
        ];
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/unknown sector/i);
      });

      it('should refuse cwps mentionned twice', () => {
        let invalid = [
          {
            cwpId: 4,
            sectors: ['KF', 'KD']
          }, {
            cwpId: 4,
            sectors: ['UF']
          }
        ];
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/multiple times/i);
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
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/multiple times/i);
      });

      it('should reject if a sector is missing', () => {
        let invalid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF']
          }
        ];
        expect(() => validator.validate(invalid, cwpTree, sectorTree)).to.throws(/missing/i);
      });

      it('should return true provided a valid map', () => {
        let valid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF']
          }, {
            cwpId: 3,
            sectors: ['KD']
          }
        ];

        expect(() => validator.validate(valid, cwpTree, sectorTree)).to.not.throws();
        validator.validate(valid, cwpTree, sectorTree).should.eql(true);
      });

      it('should accept disabled positions without sectors bound', () => {
        let valid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF']
          }, {
            cwpId: 3,
            sectors: ['KD']
          }, {
            cwpId: 6,
            sectors: []
          }
        ];

        expect(() => validator.validate(valid, cwpTree, sectorTree)).to.not.throws();
        validator.validate(valid, cwpTree, sectorTree).should.eql(true);
      });

      it('should accept other position types without sectors bound', () => {
        let valid = [
          {
            cwpId: 4,
            sectors: ['UF', 'KF']
          }, {
            cwpId: 3,
            sectors: ['KD']
          }, {
            cwpId: 1,
            sectors: []
          }
        ];

        expect(() => validator.validate(valid, cwpTree, sectorTree)).to.not.throws();
        validator.validate(valid, cwpTree, sectorTree).should.eql(true);
      });
    });
  });
});