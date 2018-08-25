/*
 * import  Api  from '@/api';
 */


import { httpGet, httpPost } from '@/scripts/lib/axiosEx'
import storage from '@/scripts/lib/storage'
import { ACTIVE_NAME } from '@/constants/index'
// http://wx.gdmmyd.net
const apiprefix = `/${ACTIVE_NAME}`;

export default {
  /**
   * 获取用户初始化状态
   */
  userSituation () {
    let _search = location.search,
      _url = apiprefix + '/Api/userSituation' + _search;
    return httpGet(_url);
  },
  /**
   * 微信配置
   */
  wxSDKRegister () {
    let _url = apiprefix + '/Api/wechatInitConfig',
      _data = {
        url: encodeURIComponent(location.href.split('#')[0])
      }
    return httpPost(_url, _data);
  },
  /**
   * 获取手机号验证码
   *
   * @param {any} data 包含手机号 phone
   * @returns
   */
  userVerifyCode (data) {
    let _url = apiprefix + '/Api/userVerifyCode',
      _data = {
        ...data
      };
    return httpPost(_url, _data);
  },
  /**
   * 登录
   *
   * @param {any} data  包含手机号phone 验证码code
   * @returns
   */
  userLogin (data) {
    let _url = apiprefix + '/Api/userLogin',
      _data = {
        ...data
      };

    return new Promise((resolve, reject) => {
      httpPost(_url, _data)
        .then(response => {
          !!response.content.token && storage.set('token', response.content.token); //保存token到本地
          resolve(response);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        })
    })
  },
  /**
   * 埋点请求
   *
   * @param {any} data
    'event': 'click',
    'type': 'getFlow',
    'active' :<String>
   * @returns
   */
  mars(data) {
    let _url = 'http://wx.gdmmyd.net/burypoint/Mar/seed',
      _data = {
        ...data,
        active: ACTIVE_NAME
      };
    return httpPost(_url, _data);
  }
}
