export default class Cwp {

  constructor(obj) {
    Object.assign(this, obj);
    return this;
  }

  isCwp() {
    return this.type === 'cwp';
  }

  isSupervisor() {
    return true;
  }

  isFlowManager() {
    return true;
  }
};
