/**
 * cookie 封装
 *
 * @class Cookie
 */
class Cookie {
  setCookie(name, value, expireHours) {
    let date = new Date()
    date.setHours(date.getHours() + expireHours)
    document.cookie = name + '=' + escape(value) + ((expireHours == null) ? '' : ';expires=' + date.toGMTString())
  }

  getCookie(name) {
    let arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }

  removeCookie(name) {
    this.setCookie(name, 1, -1);
  }
}

export default new Cookie();
