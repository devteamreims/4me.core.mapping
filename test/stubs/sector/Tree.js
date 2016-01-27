import sectorBootstrapStub from './bootstrap';

export default class SectorTree {
  constructor() {
    this.tree = sectorBootstrapStub();
  }

  getElementary() {
    return this.tree.filter((s) => s.elementarySectors.length === 1);
  }

  getFromElementary(sectors = []) {
    return this.tree.find((s) => _.eq(s.elementarySectors.sort(), sectors.sort()));
  }
}
