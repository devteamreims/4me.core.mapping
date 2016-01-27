import cwpBootstrapStub from './bootstrap';

export default class CwpTree {
  constructor() {
    this.tree = cwpBootstrapStub();
    this.tree.forEach((c) => {
      c.isCwp = () => true;
    });
  }

  getAll() {
    return this.tree;
  }
}
