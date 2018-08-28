export default {
  /**
    * 显示或者隐藏登录框
    * @param {*} state
    */
  toggleLogin(state, isShowLogin) {
    isShowLogin !== undefined ? state.isShowLogin = isShowLogin : state.isShowLogin = !state.isShowLogin;
  },
  /**
   * 设置用户信息
   *
   * @param {any} state
   * @param {any} userInfo
   */
  setUserInfo(state, userInfo) {
    state.userInfo = {
      ...state.userInfo,
      ...userInfo
    }
  },
  /**
   * 设置抽奖盘的实例对象
   *
   * @param {any} state
   * @param {any} dom
   */
  setLotteryPlateDom(state, dom) {
    state.lotteryPlateDom = dom;
  },
  /**
   * 显示对话弹框
   *
   * @param {any} state
   * @param {any} opts
   */
  showDialog(state, opts) {
    state.dialog = {
      ...state.dialogOrigin,
      ...opts,
      isShow: true
    }
  },
  /**
   * 隐藏对话弹框
   *
   */
  closeDialog(state) {
    state.dialog.isShow = false;
  },
  /**
   * 隐藏或者显示活动规则
   *
   */
  toggleRule(state, isShowRules) {
    isShowRules !== undefined ? state.isShowRules = isShowRules : state.isShowRules = !state.isShowRules;
  },
  /**
   * 显示或者隐藏二维码
   * @param {*} state
   */
  toggleQrDialog(state) {
    state.qrDialog.isShow = !state.qrDialog.isShow;
  },
  /**
   * 隐藏或者是否显示分享提示
   *
   */
  toggleShareTips(state, isShowShareTips) {
    isShowShareTips !== undefined ? state.isShowShareTips = isShowShareTips : state.isShowShareTips = !state.isShowShareTips;
  }
}
