export default class Sector {

  constructor(obj, tree) {
    Object.assign(this, obj);
    return this;
  }

  isElementary() {
    return true;
  }
};