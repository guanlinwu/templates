/**
 * 微信配置文件
 */
import wx from 'weixin-js-sdk';


import Api from '@/api/index';
// import Public from '../Public';
import { ACTIVE_NAME } from '@/constants/index';

const fileprefix = `http://wx.gdmmyd.net/actives/${ACTIVE_NAME}`;
let hasRegister = false; //是否已经配置过

export const wechatConfig = (opts) => {
  let ua = window.navigator.userAgent.toLowerCase();

  return new Promise((resolve, reject) => {

    if (/MicroMessenger/i.test(ua)) { //如果是微信端
      // let cl = Public.toParams().cl || 'wx';
      let shareOpenid = !!opts && opts.shareOpenid;
      let link = shareOpenid ? `http://wx.gdmmyd.net/${ACTIVE_NAME}/Index/index/shareOpenid/${shareOpenid}` : `http://wx.gdmmyd.net/${ACTIVE_NAME}/Index/index`;
      console.log('sharelink ' + link)
      console.log('shareOpenid ' + shareOpenid)
      let options = {
        link,
        // link: `http://wx.gdmmyd.net/${ACTIVE_NAME}/index/index/cl/${cl}`,
        imgUrl: fileprefix + '/static/images/sharepic.jpg?v=20180920',
        ...opts,
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        },
        fail: function () {

        }
      };
      console.log('配置分享hasRegister: ' + hasRegister)

      if (hasRegister) { //如果已经初始化
        wx.ready(function () {
          wx.onMenuShareAppMessage(options);
          wx.onMenuShareTimeline(options);
          wx.hideMenuItems({
            menuList: [
              'menuItem:copyUrl'
            ]
          })
          // wx.hideOptionMenu();//屏蔽分享
          wx.showOptionMenu();//取消屏蔽分享
          resolve();
        });
      } else { //初次初始化
        Api.wxSDKRegister().then(res => {
          if (res.flag) {
            hasRegister = true;
            var content = res.content;
            wx.config({
              debug: false,
              appId: content.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
              timestamp: content.timestamp, // 必填，生成签名的时间戳
              nonceStr: content.nonceStr, // 必填，生成签名的随机串
              signature: content.signature, // 必填，签名，见附录1
              jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideMenuItems'
              ] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
              wx.onMenuShareAppMessage(options);
              wx.onMenuShareTimeline(options);
              wx.hideMenuItems({
                menuList: [
                  'menuItem:copyUrl'
                ]
              })
              console.log('屏蔽分享')
              wx.hideOptionMenu();//屏蔽分享
              // wx.showOptionMenu();//取消屏蔽分享
              resolve();
            });
            wx.error(function (res) {
              hasRegister = false;
              console.log('wx err ', JSON.stringify(res));
              reject('wx jssdk error');
            });
          }
        }).catch(err => {
          hasRegister = false;
          console.log('wxSDKRegister error ' + JSON.stringify(err));
          reject('wxSDKRegister res error');
        });
      }
    } else {
      console.log('非微信端');
      reject('非微信端');
    }

  });
}

