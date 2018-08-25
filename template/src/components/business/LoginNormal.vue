<!--
 * 无弹框的登录框
 * usage
 <LoginDialog :isShow="isShowLogin" :submitSuccessCb="setUserSituation"></LoginDialog>

Api.userSituation().then((res) => {
  this.$loading().hide();
  if (res.flag) { //如果成功获取号码
    this.setUserSituation(res);
  } else { //如果获取号码失败
    this.toggleLogin(true); //显示登录框
  }
}, () => {
  this.$loading().hide();
});

setUserSituation (res) { //业务逻辑
  let content = res.content;
  this.setUserInfo({
    ...content
  });
}
-->
<template>
  <transition name='f-fade'>
    <!-- <div class="dialog e-login" @click.self.stop="toggleLogin(false)" v-show=isShow> -->
    <div class="u-login e-login" v-show=isShow>
      <div class="content">
          <!-- <header class="title">登录</header> -->
          <div class="input-box">
            <div class="input-item">
                <input v-model="phone" type="tel" maxlength="11" class="j-phone" placeholder="请在此输入手机号码" />
            </div>
            <div class="input-item">
                <input v-model="code" class="e-code j-code" type="number" placeholder="请在此输入验证码" />
                <a @click="getCode" class="btn-code j-get-code" :class="{'e-disable' : isGettingCode}" href="javascript:;">\{{codeText}}</a>
            </div>
          </div>
        </div>
        <div class="footer">
            <a @click="submitLogin" class="btn hardline j-login" href="javascript:;">提交</a>
        </div>
        <p class="agree-rule"><span @click="toggleAgreeRules" class="is-agree" :class="{'e-active': isAgreeRule}"></span>我已阅读并同意 <span @click="$store.commit('toggleRule', true)" class="em">《活动规则》</span> </p>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Api from '@/api';
import Public from '@/scripts/Public';
export default {
  name: 'LoginNormal',
  props: {
    isShow: Boolean, //是否显示登录框
    submitSuccessCb: Function //成功登录的回调函数
  },
  data () {
    return {
      phone : '',
      code : '',
      isGettingCode: false, //是否正在获取验证码
      codeText: '获取验证码',
      isAgreeRule: true //是否同意活动规则
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations([
      'setUserInfo',
      'toggleLogin'
    ]),
    /**
     * 获取验证码
     */
    getCode () {
      /**
       * 如果正在获取验证码
       */
      let self = this;
      if (self.isGettingCode) {
      } else {
        /**
         * 验证手机号，执行请求验证码逻辑
         */
        if (!Public.isMobileNum(self.phone)) { //如果格式不正确的手机号
          self.$toast({
            message: '请输入正确格式的手机号码'
          });
        } else {
          let data = {
            phone : self.phone
          }
          /**
           * 如果是格式正确的验证码
           */
          self.isGettingCode = true;
          self.$loading().show();
          self.setUserInfo({
            phone : self.phone
          });
          console.log('userInfo ', self.$store.state.userInfo.phone)

          Api.userVerifyCode(data).then(res => {
            self.$loading().hide();
            if (res.flag) { //如果返回成功
              self.$toast({
                message: res.message
              });

              let count = 90,
                timer = setInterval(function () {
                  count--;
                  if (count <= 0) {
                    clearInterval(timer);
                    self.codeText = '获取验证码';
                    self.isGettingCode = false;
                  } else {
                    self.codeText = '已发送' + count + 's';
                  }
                }, 1000);
            } else { //后端返回获取失败信息
              self.$toast({
                message: res.message
              });
              self.isGettingCode = false;
            }
          }, error => {
            self.$loading().hide();
            self.isGettingCode = false;
            console.log(`message: '网络状态不好～'`)
          })

        }
      }
    }, // end getCode
    /**
     * 提交手机号和验证码
     */
    submitLogin () {
      let _code = this.code,
        _phone = this.phone,
        _data = {
          phone : _phone,
          code : _code
        },
        self = this;

      //如果没有同意活动规则
      if (!this.isAgreeRule) {
        self.$toast({message: '请先同意活动规则哦～'});
        return;
      }

      if (_code === '' || _phone === '') {
        self.$toast({ message: '手机号或者验证码不能为空' });
        return;
      }

      if (!Public.isMobileNum(self.phone)) { //如果格式不正确的手机号
        self.$toast({
          message: '请输入正确格式的手机号码'
        });
      } else {
        self.$loading().show();

        Api.userLogin(_data).then(res => {
          self.$loading().hide();

          if (res.flag) { //登录成功
            self.toggleLogin(false); //关闭登录框
            self.submitSuccessCb && typeof self.submitSuccessCb === 'function' && self.submitSuccessCb(res);

          } else { //登录失败
            this.setUserInfo({
              lineServiceUrl: res.content.lineServiceUrl
            });
            self.$toast({message: res.message});
          }
        }, error => {
          self.$loading().hide();
          self.isGettingCode = false;
          console.log(`message: '网络状态不好～'`)
        });
      }
    }, // end submitLogin
    toggleAgreeRules () {
      this.isAgreeRule = !this.isAgreeRule;
    } // end toggleAgreeRules
  } // end methods
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.e-login {

  .content {
      padding: 0.3rem 0 .24rem;

  }

  .input-box {
      position: relative;

      & input {
          width: 100%;
          height: 0.76rem;
          padding-left: 0.3rem;
          font-size: 0.24rem;
          line-height: 0.76rem;
          color: #888888;
          border-radius: 0.4rem;
          -webkit-appearance: none;
          outline:none;
          border: 1px solid #888888;

          &.e-code {
              padding-right: 2rem;
          }
      }

      .input-item {
          position: relative;
          margin-top: 0.18rem;
          text-align: left;
          font-size: 0;
      }

      .input-item:first-child {
          margin-top: 0;
      }

      .btn-code {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 2.6rem;
          height: 100%;
          line-height: 0.76rem;
          color: #ffffff;
          font-size: 0.24rem;
          background: #ff563e;
          text-align: center;
          border-radius: 0.5rem;

          &.e-disable {
              background: #ccc;
              pointer-events: none;
          }
      }
  }

  .footer {
    font-size: 0;

    .btn {
      flex: 1;
      display: inline-block;
      width: 100%;
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 0.28rem;
      color: #fff;
      text-align: center;
      border-radius: .08rem;
      background: linear-gradient(top, #fb4388, #fe2d7a);
      box-shadow: 0 -3px 0 #c6004d inset;
    }
  }
}

.agree-rule {
  cursor: pointer;
  font-size: .2rem;
  color: #888888;
  line-height: 1.5;
  padding: .2rem .6rem 0 0;

  .is-agree {
    display: inline-block;
    vertical-align: middle;
    width: .3rem;
    height: .3rem;
    margin: -.06rem .06rem 0;
    border: 1px solid #333;
    border-radius: 50%;

    &.e-active {
      background: url(../../assets/images/is_agree.png) no-repeat;
      background-size: 100% 100%;
      border: none;
    }

  }

  .em {
    color: #333333;
  }
}
</style>
