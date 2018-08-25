import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      phone: '-', //手机号码
      flow: '--', //剩余流量
      balance: '--', //余额
      totalFlow: '--', //总流量
      curMeal: '--', //已办套餐
      lineServiceUrl: 'javascript:;', //客服链接
      consumeHistory: { //消费记录
        avg: '--',
        list: [
          '--', '--', '--'
        ]
      },
      flowHistory: { //流量记录
        avg: '--',
        list: [
          '--', '--', '--'
        ]
      }
    }, //保存用户信息 phone
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
    isShowLogin: false, //是否登录
    isShowRules: false, //是否显示活动规则
    isShowShareTips: false //是否显示分享提示
  },
  mutations,
  actions: {

  }
})
