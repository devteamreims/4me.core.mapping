import { getChangedClientIds } from './notifier';

describe('map::notifier', () => {
  const validMap = [
    {cwpId: 20, sectors: ['UR', 'XR']},
    {cwpId: 21, sectors: ['KR', 'HYR']},
    {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
    {cwpId: 23, disabled: true},
    {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
  ];

  const validMap2 = [
    {cwpId: 20, sectors: ['UR', 'XR']},
    {cwpId: 21, sectors: ['KR', 'HYR']},
    {cwpId: 22, sectors: ['UB', 'UN']},
    {cwpId: 23, sectors: ['KN', 'HN']},
    {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
  ];


  const invalidMap = [
    {cwpId: 1, sectors: ['UR', 'XR']},
    {cwpId: 2, sectors: ['KR', 'HYR']},
    {cwpId: 3, sectors: ['UB', 'UN', 'KN', 'HN']},
    {cwpId: 4, disabled: true, sectors: ['E', 'SE']},
  ];


  test('should reject invalid arguments', () => {
    expect(() => getChangedClientIds()).toThrow(/argument/i);
    expect(() => getChangedClientIds(1)).toThrow(/argument/i);
    expect(() => getChangedClientIds(1, 2)).toThrow(/argument/i);
    expect(() => getChangedClientIds('str', 'str')).toThrow(/argument/i);
    expect(() => getChangedClientIds([], {cwpId: 1})).toThrow(/argument/i);

    expect(() => getChangedClientIds(validMap, invalidMap)).toThrow(/argument/i);
    expect(() => getChangedClientIds(invalidMap, validMap)).toThrow(/argument/i);
  });

  test('should accept valid arguments', () => {
    expect(() => getChangedClientIds(validMap, validMap2)).not.toThrow();
  });

  test('should return an empty array if nothing has changed', () => {
    expect(getChangedClientIds(validMap, validMap)).toEqual([]);
    expect(getChangedClientIds(validMap2, validMap2)).toEqual([]);
  });

  // From this point on, we'll only transition from validMap to another map and check return values
  test('should include clients with removed sectors', () => {
    const newMap = [
      // Move ['UR', 'XR'] to cwpId: 11
      {cwpId: 11, sectors: ['UR', 'XR']},
      {cwpId: 21, sectors: ['KR', 'HYR']},
      {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
      {cwpId: 23, disabled: true},
      {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
    ];

    expect(getChangedClientIds(validMap, newMap)).toContain(20);
  });

  test('should not include unchanged sectors', () => {
    const newMap = [
      // Move ['UR', 'XR'] to cwpId: 11
      {cwpId: 11, sectors: ['UR', 'XR']},
      {cwpId: 21, sectors: ['KR', 'HYR']},
      {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
      {cwpId: 23, disabled: true},
      {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
    ];

    const changed = getChangedClientIds(validMap, newMap);
    expect(changed).not.toContain(21);
    expect(changed).not.toContain(22);
    expect(changed).not.toContain(23);
    expect(changed).not.toContain(30);
  });

  test('should include clients with added sectors', () => {
    const newMap = [
      // Move ['UR', 'XR'] to cwpId: 11
      {cwpId: 11, sectors: ['UR', 'XR']},
      {cwpId: 21, sectors: ['KR', 'HYR']},
      {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
      {cwpId: 23, disabled: true},
      {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
    ];

    expect(getChangedClientIds(validMap, newMap)).toContain(11);
  });

  test('should include clients with a new disabled status', () => {
    const newMap = [
      {cwpId: 20, sectors: ['UR', 'XR']},
      {cwpId: 21, sectors: ['KR', 'HYR']},
      {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
      // {cwpId: 23, disabled: true},
      {cwpId: 11, disabled: true},
      {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
    ];

    expect(getChangedClientIds(validMap, newMap)).toContain(23);
    expect(getChangedClientIds(validMap, newMap)).toContain(11);
  });
});
