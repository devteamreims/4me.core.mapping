import validate from './validator';

describe('map::validator', () => {
  test('should reject invalid arguments', () => {
    expect(() => validate()).toThrow(/argument/i);
    expect(() => validate({foo: 'bar'})).toThrow(/argument/i);
    expect(() => validate(2)).toThrow(/argument/i);
  });

  test('should reject items without sectors or disabled status', () => {
    const invalidMaps = [
      [{cwpId: 11}],
      [{cwpId: 11, disabled: false}],
    ];

    invalidMaps.forEach(invalidMap => expect(() => validate(invalidMap)).toThrow(/wrong format/i));
  });

  test('should reject non CWP client ids', () => {
    const invalidMap = [{cwpId: 1, sectors: ['UR', 'XR']}];

    expect(() => validate(invalidMap)).toThrow(/non-CWP type/i);
  });

  test('should reject items with sectors and disabled status set to true', () => {
    const invalidMap = [{cwpId: 11, sectors: ['UR'], disabled: true}];

    expect(() => validate(invalidMap)).toThrow(/disabled CWP/i);
  });

  test('should reject cwps mentionned multiple times', () => {
    const invalidMap = [{cwpId: 11, sectors: ['UR']}, {cwpId: 11, sectors: ['UR']}];

    expect(() => validate(invalidMap)).toThrow(/multiple/i);
  });

  test('should reject unknown sectors', () => {
    const invalidMap = [{cwpId: 11, sectors: ['NONEXISTENTSECTOR']}];

    expect(() => validate(invalidMap)).toThrow(/unknown sectors/i);
  });

  test('should reject sectors mentionned multiple times', () => {
    const invalidMap = [
      {cwpId: 11, sectors: ['UR', 'XR']},
      {cwpId: 12, sectors: ['KR', 'HYR']},
      {cwpId: 13, sectors: ['UR']},
    ];

    expect(() => validate(invalidMap)).toThrow(/sectors multiple time/i);
  });

  // All tests use 'LFEE' environment, see <PROJECT_ROOT>/tests/testSetup.js
  test('should accept valid map', () => {
    const validMap = [{
      cwpId: 11,
      sectors: [
        "UR",
        "XR",
        "KR",
        "HYR",
        "UB",
        "UN",
        "KN",
        "HN",
        "UE",
        "XE",
        "KE",
        "HE",
        "UH",
        "XH",
        "KH",
        "HH",
        "KD",
        "UF",
        "KF",
        "E",
        "SE",
      ],
    }, {
      cwpId: 13,
      disabled: true,
    }];

    expect(() => validate(validMap)).not.toThrow();
  });


});
