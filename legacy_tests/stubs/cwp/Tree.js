import cwpBootstrapStub from './bootstrap';
import Cwp from './Cwp';

export default class CwpTree {
  constructor() {
    this.tree = [];
    const tempTree = cwpBootstrapStub();
    tempTree.forEach((c) => {
      this.tree.push(new Cwp(c));
    });
  }

  getAll() {
    return this.tree;
  }

  getById(cwpId) {
    return this.tree.find((cwp) => cwp.id === parseInt(cwpId));
  }

  getByType(type = '') {
    return this.tree.filter((cwp) => cwp.type === type);
  }
}
