/**
 * 微信配置文件
 */
import wx from 'weixin-js-sdk';


import Api from '@/api/index';
import Public from '../Public';
import { ACTIVE_NAME } from '@/constants/index';

const fileprefix = `http://wx.gdmmyd.net/actives/${ACTIVE_NAME}`;

export const wechatConfig = (opts) => {
  let ua = window.navigator.userAgent.toLowerCase();
  if (/MicroMessenger/i.test(ua)) { //如果是微信端
    let cl = Public.toParams().cl || 'wx';
    let options = {
      ...opts,
      link: `http://wx.gdmmyd.net/${ACTIVE_NAME}/index/index/cl/${cl}`,
      // link: `http://wx.gdmmyd.net/${ACTIVE_NAME}/Api/urlRedirect/cl/wx`,
      imgUrl: fileprefix + '/static/images/sharepic.jpg',
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      },
      fail: function () {

      }
    };

    Api.wxSDKRegister().then(res => {
      if (res.flag) {
        var content = res.content;
        wx.config({
          debug: false,
          appId: content.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: content.timestamp, // 必填，生成签名的时间戳
          nonceStr: content.nonceStr, // 必填，生成签名的随机串
          signature: content.signature, // 必填，签名，见附录1
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ] // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
          wx.onMenuShareAppMessage(options);
          wx.onMenuShareTimeline(options);
        });
        wx.error(function (res) {
          console.log('wx err ', JSON.stringify(res));
        });
      }
    }).catch(err => {
      console.log('wxSDKRegister error ' + JSON.stringify(err));
    });
  } else {
    console.log('非微信端')
  }
}

