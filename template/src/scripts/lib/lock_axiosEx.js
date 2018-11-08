/**
 * 配置axios
 */
import axios from 'axios';
import {
  polyfill
} from 'es6-promise';
import storage from '@/scripts/lib/storage'
import qs from 'qs';

polyfill();
// axios 配置
// axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = 'http://localhost:4000/';

/**
 * 配置请求锁
 */
const Locker = {
  isDo        : null, //是否已经在执行拦截请求
  _resolveArr : [], //把阻塞器添加队列
  release(middlewareFn) { //释放阻塞器
    this._resolveArr.forEach(_resolve => {
      _resolve(middlewareFn);
    });
  }
}
/**
 * 拦截发出去的请求
 */
axios.interceptors.request.use((config) => {
  let _resolve = null; //保存resolve

  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }

  const token = storage.get('token'); //离开的时候需要删除

  if (token) {
    config.headers.__token__ = `${token}`;
    return config;
  } else {
    if (!Locker.isDo) {
      /**
       * 模拟请求token
       */
      console.log('fetching token')
      setTimeout(() => {
        console.log('have got token')
        Locker.release((config) => { //释放阻塞器
          config.headers.__token__ = `x-own-token`;
        });
        storage.set(token, 'x-own-token');
      }, 5000);
      Locker.isDo = true
    }

    return new Promise((resolve) => {
      _resolve = (middlewareFn) => { //进行阻塞
        middlewareFn(config)
        resolve(config);
      };
      Locker._resolveArr.push(_resolve); //把阻塞器添加队列
    });
  }
}, (error) => {
  return Promise.reject(error);
});

/**
 * 拦截返回的状态
 */
axios.interceptors.response.use((res) => {
  // if (!res.data.success) {
  //   return Promise.reject(res);
  // }
  return res;
}, (error) => {
  /**
   * 对错误接口进行埋点
   */
  MtaH5.clickStat('requestErr', {
    url: `${error.config.url}`,
    method: `${error.config.method}`,
    data: `${error.config.data}`,
    status: `${error.response.status}`
  })
  return Promise.reject(error);
});

export function httpPost(url, params, otherOpts) {
  let _data = {
    method: 'post',
    url,
    data: params,
    ...otherOpts
  }

  return new Promise((resolve, reject) => {
    axios({
      ..._data
    }).then(response => {
      resolve(response.data); //只返回data
    }).catch((error) => {
      console.log('axios post catch ->>>>>>>', error)
      reject(error)
    })
  })
}

export function httpGet(url, params, otherOpts) {
  let _data = {
    method: 'get',
    url,
    data: params,
    ...otherOpts
  }
  return new Promise((resolve, reject) => {
    axios({
      ..._data
    }).then(response => {
      resolve(response.data); //只返回data
    }).catch((error) => {
      console.log('axios get catch error->>>>>>>>', error)
      reject(error);
    })
  })
}

export default axios;
