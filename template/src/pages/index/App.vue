<template>
  <div class="wrapper" id="app">
    <!-- loading -->
    <section class="banner">
      <!-- 用户信息 -->
    </section>
    <section class="content">
      vue脚手架
    </section>
    <!-- 活动规则 -->
    <RulePop :isShow="isShowRules"/>
    <RuleNormal/>
    <!-- 底部 -->
    <Footer></Footer>
    <!-- 对话框 -->
    <Dialog :dialog="dialog" :closeDialog="closeDialog">
    </Dialog>
    <!-- 分享蒙层 -->
    <SharePop :isShow="isShowShareTips" :close="toggleShareTips"/>
    <!-- 登录框 -->
    <LoginDialog :isShow="isShowLogin" :submitSuccessCb="setUserSituation"></LoginDialog>
    <!-- 关注二维码对话框 -->
    <Dialog :dialog="qrDialog">
      <p class="qrcode-tips">长按识别或扫描以下二维码关注茂名移动公众号</p>
      <img class="img-qrcode" src="./assets/images/qrcode.jpg" alt="">
    </Dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import Api from '@/api';
import SharePop from '@/components/common/SharePop/SharePop';
import Footer from '@/components/common/Footer/Footer';
import Dialog from '@/components/common/Dialog/Dialog';

import RulePop from '@/components/business/RulePop';
import RuleNormal from '@/components/business/RuleNormal';
import LoginDialog from '@/components/business/LoginDialog';


import '@/styles/index.scss';

export default {
  name: 'App',
  data () {
    return {
    }
  },
  components: {
    // UserInfo, //用户信息
    Dialog, //弹窗
    RulePop, //弹窗活动规则
    RuleNormal, //不弹窗的活动规则
    SharePop, //分享蒙层
    Footer, //底部
    LoginDialog //登录
  },
  computed: {
    ...mapState([
      // 'userInfo',
      'dialog',
      'isShowLogin',
      'isShowShareTips',
      'isShowRules'
    ])
  },
  mounted () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      // this.$loading().show();
      // Api.userSituation().then((res) => {
      //   this.$loading().hide();
      //   if (res.flag) { //如果成功获取号码
      //     this.setUserSituation(res);
      //   } else { //如果获取号码失败
      //     this.toggleLogin(true); //显示登录框
      //   }
      // }, () => {
      //   this.$loading().hide();
      // });
    });
    // this.showDialog({
    //   title: '欢迎',
    //   message: '这是一个弹框，点击确认或者黑色遮罩会消失'
    // });
    // this.toggleRule();
    // this.toggleLogin();
    // this.$toast({message: 'welcome! loginbox will disappear after 4S'});
    // setTimeout(() => {
    //   this.toggleLogin();
    // }, 4000);
  },
  methods: {
    ...mapMutations([
      'setUserInfo',
      'toggleLogin',
      'showDialog',
      'toggleRule',
      'toggleShareTips',
      'closeDialog'
    ]),
    setUserSituation (res) {
      let content = res.content;
      this.setUserInfo({
        ...content
      });
    }
  }
}

</script>

<style lang="scss">

html {
  background-color: #fff;
  min-height: 100%;
  text-align: center;
}

.wrapper {
  background: #f3f4f5;
}

.content {

}
//二维码弹窗
.qrcode-tips {
  font-size: 0.2rem;
  color: #888;
  text-align: center;
}

.img-qrcode {
  margin: 0.16rem auto 0.4rem;
  width: 4rem;
  pointer-events: auto;
}
</style>
