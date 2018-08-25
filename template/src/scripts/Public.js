'use strict';
import storage from '@/scripts/lib/storage'

// 活动
const Public = (() => {
  return {
    /**
     *  * {a:1,b:2,c:3} -> params(...) -> a=1&b=2&c=3
     */
    toParams () {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = {};
      if (url.indexOf('?') !== -1) {
        var str = url.substr(1);
        var strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
      }
      return theRequest;
    },
    //判断是否是手机号
    isMobileNum (value) {
      value = value.toString();
      if (value.length !== 11) {
        return false;
      }
      return /^1[0-9]{10}$/.test(value);
    },
    //加密手机号
    encryptPhone (phone) {
      return phone.substr(0, 3) + '****' + phone.substr(phone.length - 4);
    }
  };

})();

/**
 * 页面关闭前，清楚保存的数据
 */
window.onbeforeunload = function () {
  storage.clear();
}


export default Public;
