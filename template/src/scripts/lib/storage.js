/**
 * 封装一个本地存储模块
 *
 * @export
 * @class Storage
 */
class Storage {
  constructor () {
    this.localStorage = window.localStorage;
    this.SUPPORT = !!this.localStorage;
  }
  set (key, value) {
    this.SUPPORT && this.localStorage.setItem(key, value);
    return this;
  }

  get (key) {
    return this.SUPPORT ? this.localStorage.getItem(key) : undefined;
  }

  remove (key) {
    this.SUPPORT && this.localStorage.removeItem(key);
    return this;
  }

  clear () {
    this.SUPPORT && this.localStorage.clear();
    return this;
  }
}
window.Storage = new Storage();
export default new Storage();
