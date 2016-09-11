import {APPDIR} from '../settings'

// Stubs
import * as SectorTreeStub from '../stubs/sector/Tree';

let validSectorArguments = {
  name: 'UXR',
  elementarySectors: ['UR', 'XR'],
  canAccept: [],
  canGive: []
};

let modulePath = APPDIR + 'sector/Sector';
let moduleStubs = {
  './Tree': SectorTreeStub
};

let tree = new SectorTreeStub.default();

describe('Sector', function() {
  let Sector;

  beforeEach(() => {
    Sector = proxyquire(modulePath, moduleStubs).default;
  });

  describe('constructor', () => {
    it('should instantiate with valid data', () => {
      let sector = new Sector(validSectorArguments, tree);
      sector.constructor.name.should.eql('Sector');
      sector.name.should.eql(validSectorArguments.name);
      sector.elementarySectors.should.deep.eql(validSectorArguments.elementarySectors);
      sector.canGive.should.deep.eql(validSectorArguments.canGive);
      sector.canAccept.should.deep.eql(validSectorArguments.canAccept);
    });

    it('should reject invalid arguments', () => {
      expect(() => new Sector()).to.throw(/Invalid argument/);
      expect(() => new Sector(null, [])).to.throw(/Invalid argument/);
      expect(() => new Sector({}, [])).to.throw(/Invalid argument/);
    });

    it('should reject without a name', () => {
      let args = _.cloneDeep(validSectorArguments);
      args.name = undefined;
      expect(() => new Sector(args, tree)).to.throw(/without a name/);
    
      args.name = {};
      expect(() => new Sector(args, tree)).to.throw(/without a name/);
    });

    it('should reject without elementary sectors', () => {
      let args = _.cloneDeep(validSectorArguments);
      args.elementarySectors = undefined;
      expect(() => new Sector(args, tree)).to.throw(/without elementarySectors/);
    
      args.elementarySectors = [];
      expect(() => new Sector(args, tree)).to.throw(/without elementarySectors/);
    });

  })

});