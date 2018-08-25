/**
 * 配置axios
 */
import axios from 'axios';
import { polyfill } from 'es6-promise';
import storage from '@/scripts/lib/storage'
import qs from 'qs';

polyfill();
// axios 配置
// axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = 'http://localhost:4000/';

/**
 * 拦截发出去的请求
 */
axios.interceptors.request.use((config) => {
  const token = storage.get('token'); //离开的时候需要删除
  if (token) {
    config.headers.__token__ = `${token}`;
  }
  // config.headers.__token__ = `123456token`;
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
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
  // console.log(res)
  return res;
}, (error) => {
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
