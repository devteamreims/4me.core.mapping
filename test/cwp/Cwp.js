import {APPDIR} from '../settings'


let validCwpArguments = {
  id: 20,
  ipAddr: [],
  disabled: false,
  type: 'cwp',
  suggestions: {
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
      cwp.type.should.eql(validCwpArguments.type);
      cwp.suggestions.should.deep.eql(validCwpArguments.suggestions);
    });

    it('should reject invalid arguments', () => {
      expect(() => new Cwp()).to.throw(/Invalid argument/i);
      expect(() => new Cwp({})).to.throw(/Invalid argument/i);
    });

    it('should reject without an id', () => {
      let args = _.cloneDeep(validCwpArguments);
      args.id = undefined;
      expect(() => new Cwp(args)).to.throw(/without an id/i);

      args.id = 0;
      expect(() => new Cwp(args)).to.throw(/without an id/i);
    });

    it('should reject invalid types', () => {
      let args = _.cloneDeep(validCwpArguments);
      args.type = 'foo';
      expect(() => new Cwp(args)).to.throw(/invalid type/i);
    });

    it('should have proper fallbacks', () => {
      let args = _.cloneDeep(validCwpArguments);
      args.ipAddr = undefined;
      let cwp = new Cwp(args);

      cwp.ipAddr.should.eql([]);

      args = _.cloneDeep(validCwpArguments);
      args.type = undefined;
      cwp = new Cwp(args);
      cwp.type.should.eql('cwp');

    });

    it('should merge only specific fields for suggestions', () => {
      let args = _.cloneDeep(validCwpArguments);
      args.suggestions = undefined;

      let cwp = new Cwp(args);

      cwp.suggestions.filteredSectors.should.eql([]);
      cwp.suggestions.preferenceOrder.should.eql([]);

      args.suggestions = {
        filteredSectors: ['UR', 'XR'],
        foo: 'bar'
      };

      cwp = new Cwp(args);

      cwp.suggestions.should.not.have.keys('foo');

    });

    it('should have identification methods', () => {
      let cwp = new Cwp(validCwpArguments);

      cwp.isCwp.should.be.a('function');
      cwp.isFlowManager.should.be.a('function');
      cwp.isSupervisor.should.be.a('function');

      cwp.isCwp().should.eql(true);
      cwp.isFlowManager().should.eql(false);
      cwp.isSupervisor().should.eql(false);

      let args = _.cloneDeep(validCwpArguments);
      args.type = 'supervisor';
      cwp = new Cwp(args);

      cwp.isCwp().should.eql(false);
      cwp.isFlowManager().should.eql(false);
      cwp.isSupervisor().should.eql(true);

      args = _.cloneDeep(validCwpArguments);
      args.type = 'flow-manager';
      cwp = new Cwp(args);

      cwp.isCwp().should.eql(false);
      cwp.isFlowManager().should.eql(true);
      cwp.isSupervisor().should.eql(false);

    });


  });

});
