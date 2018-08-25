import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
    }, //保存用户信息 phone
    isFromIndex: false, //判断是否是从首页进来的
    lotteryPlateDom : null, // 抽奖盘的实例对象
    dialogOrigin: { //dialog的原始值
      title: '',
      message: '',
      isShow: false,
      footer: {
        confirm: {
          text: '确认'
        }
        // cancel: {
        //   text: '取消',
        //   callBack () {
        //     console.log('取消')
        //   }
        // }
      }
    },
    dialog: {
      title: '',
      message: '',
      isShow: false,
      footer: {
        confirm: {
          text: '确认'
        }
      }
    },
    qrDialog: {
      title: '参与活动需先关注公众号',
      message: '',
      preventMaskClose: false, //点击蒙层是否可以关闭
      isShow: false,
      footer: {
      }
    },
    isShowLogin: false, //是否登录
    isShowRules: false, //是否显示活动规则
    isShowShareTips: false //是否显示分享提示
  },
  mutations,
  actions: {

  }
})
