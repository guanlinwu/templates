'use strict';
import storage from '@/scripts/lib/storage'

// 活动
const Public = (() => {
  return {
    /**
     *  * {a:1,b:2,c:3} -> params(...) -> a=1&b=2&c=3
     */
    toParams() {
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
    isMobileNum(value) {
      value = value.toString();
      if (value.length !== 11) {
        return false;
      }
      return /^1[0-9]{10}$/.test(value);
    },
    //加密手机号
    encryptPhone(phone) {
      return phone.substr(0, 3) + '****' + phone.substr(phone.length - 4);
    },
    /**
     * 预加载图片
     *
     * @param {array} opts.urls             图片链接
     * @param {function} opts.eachLoadFunc  每张图片加载完毕的回调
     * @param {function} opts.callback      所有图片加载完毕的回调
     */
    loadImgs(opts) {
      var urls = opts.urls, //需要预加载的图片队列
        eachLoadFunc = opts.eachLoadFunc, //每张图片加载完毕的回调
        callback = opts.callback, //所有图片加载完毕的回调

        imgNumbers = urls.length,
        loadImgNumbers = 0, //已经加载的图片数量
        percent = 0, //加载的百分数
        maxPercent = 80; //加载完毕后最大百分数，由于还要加载视频，所以设置80

      if (imgNumbers <= 0) { //如果没有图片 直接调用回调函数
        callback && typeof callback === 'function' && callback();
        return;
      }

      for (var i = 0; i < urls.length; i++) {
        var obj = new Image();
        obj.src = urls[i];
        obj.onload = function () {
          loadImgNumbers++;
          percent = Math.ceil((loadImgNumbers / imgNumbers) * maxPercent);
          eachLoadFunc && typeof eachLoadFunc === 'function' && eachLoadFunc(percent); //每一次load完都执行的函数
          if (percent >= maxPercent) { //加载结束后，隐藏相应的 loading 或遮罩
            console.log('img all load');
            callback && typeof callback === 'function' && callback();
          }
        }
        obj.onerror = function () {
          imgNumbers--;
        }
      }
    },
    /**
     * ua 模块
     */
    ua() {
      var _e,
        _ua = navigator.userAgent;
      _e = {
        weixin: _ua.indexOf('MicroMessenger') > -1, //是否微信
        android: /android|linux/i.test(_ua), //android终端
        ios: !!_ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
      };
      return _e;
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
