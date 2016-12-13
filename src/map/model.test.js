import {
  generateMap,
  set,
  get,
} from './model';
import { validate } from './validator';

describe('map::model', () => {
  describe('generateMap', () => {
    test('should generate a map', () => {
      const map = generateMap();
      expect(map).toMatchSnapshot();
    });

    test('should generate a valid map', () => {
      const map = generateMap();
      expect(validate(map)).toBe(true);
    });
  });

  describe('set', () => {
    test('should validate map', () => {
      const invalidMap = [{cwpId: 11, disabled: true}];
      return set(invalidMap).then(
        () => expect(true).toBe(false),
        err => expect(err).toMatchSnapshot(),
      );
    });

    const newMap = [{
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
      ],
    }, {
      cwpId: 12,
      sectors: ['E', 'SE'],
    }];

    test('should resolve to the new map', () => {
      return set(newMap).then(
        map => expect(map).toEqual(newMap),
      );
    });

    test('should properly set the map in the database', () => {
      return set(newMap)
        .then(() => get())
        .then(map => expect(map).toEqual(newMap));
    });
  });
});
