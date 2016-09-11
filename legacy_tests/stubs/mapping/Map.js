import CwpTreeStub from '../cwp/Tree';
import SectorTreeStub from '../sector/Tree';

let cwpTree = new CwpTreeStub();
let sectorTree = new SectorTreeStub();

export default class Map {
  constructor() {
    this.map = [];
    // Bind some sectors to some CWPs
    this.map.push({cwpId: 3, sectors: ['UF', 'KF']});
    this.map.push({cwpId: 4, sectors: ['KD']});
  }

  get() {
    return this.map;
  }
}
