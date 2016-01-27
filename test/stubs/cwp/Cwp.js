export default class Cwp {

  constructor(obj) {
    Object.assign(this, obj);
    return this;
  }

  isCwp() {
    return true;
  }

  isSupervisor() {
    return true;
  }

  isFlowManager() {
    return true;
  }
};