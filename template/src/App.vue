<template>
  <div class="wrapper" id="app">
    <router-view/>
    <!-- 活动规则 -->
    <!-- <RulePop :isShow="isShowRules"/> -->
    <!-- 底部 -->
    <Footer></Footer>
    <!-- 对话框 -->
    <Dialog :dialog="dialog" :closeDialog="closeDialog">
    </Dialog>
    <!-- 分享蒙层 -->
    <!-- <SharePop :isShow="isShowShareTips" :close="toggleShareTips"/> -->
    <!-- 登录框 -->
    <LoginDialog :isShow="isShowLogin" :submitSuccessCb="setUserSituation"></LoginDialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Api from '@/api';
// import SharePop from '@/components/common/SharePop/SharePop';
import Footer from '@/components/common/Footer/Footer';
import Dialog from '@/components/common/Dialog/Dialog';

// import RulePop from '@/components/business/RulePop';
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
    // RulePop, //弹窗活动规则
    // SharePop, //分享蒙层
    Footer, //底部
    LoginDialog //登录
  },
  computed: {
    ...mapState([
      'userInfo',
      'dialog',
      'isShowLogin'
      // 'isShowShareTips'
    ])
  },
  created () {
    /**
     * 初始化获取用户信息
     */
    this.$loading().show();
    Api.userSituation().then((res) => {
      this.$loading().hide();
    }, () => {
      this.$loading().hide();
    });
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
      'closeDialog'
    ]),
    /**
     * 处理初始化用户信息接口
     */
    setUserSituation (res) {
      let content = res.content;
      this.setUserInfo({
        ...content.userInfo
      });
    }
  }
}

</script>

<style lang="scss">

html {
  min-height: 100%;
  text-align: center;
}

.wrapper {
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

// animation
.a-pulse {
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}
</style>
