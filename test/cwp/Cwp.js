import {APPDIR} from '../settings'


let validCwpArguments = {
  id: 20,
  ipAddr: [],
  disabled: false,
  "suggestions": {
    "filteredSectors": ["URMN"],
    "preferenceOrder": ["KD", "2F"]
  }
};

let modulePath = APPDIR + 'cwp/Cwp';
let moduleStubs = {};


describe('Cwp', function() {
  let Cwp;

  beforeEach(() => {
    Cwp = proxyquire(modulePath, moduleStubs).default;
  });

  describe('constructor', () => {
    it('should instantiate with valid data', () => {
      let cwp = new Cwp(validCwpArguments);
      cwp.constructor.name.should.eql('Cwp');
      cwp.id.should.eql(parseInt(validCwpArguments.id));
      cwp.ipAddr.should.deep.eql(validCwpArguments.ipAddr);
      cwp.disabled.should.eql(validCwpArguments.disabled);
      cwp.suggestions.should.deep.eql(validCwpArguments.suggestions);
    });

    it('should reject invalid arguments', () => {
      expect(() => new Cwp()).to.throw(/Invalid argument/);
      expect(() => new Cwp({})).to.throw(/Invalid argument/);
    });

    it('should reject without an id', () => {
      let args = _.cloneDeep(validCwpArguments);
      args.id = undefined;
      expect(() => new Cwp(args)).to.throw(/without an id/);
    
      args.id = 0;
      expect(() => new Cwp(args)).to.throw(/without an id/);
    });

  });

});