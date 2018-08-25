
<!--
 * 弹框的登录框
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
    <div class="dialog e-login" v-show=isShow>
      <!-- <div class="u-mark"></div> -->
      <div class="content">
            <header class="title">登录</header>
            <div class="messages hardline">
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
            <div class="dialog-footer">
                <a @click="submitLogin" class="btn hardline j-login" href="javascript:;">提交</a>
            </div>
        </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Api from '@/api';
import Public from '@/scripts/Public';
export default {
  name: 'LoginDialog',
  props: {
    isShow: Boolean, //是否显示登录框
    submitSuccessCb: Function //成功登录的回调函数
  },
  data () {
    return {
      phone : '',
      code : '',
      isGettingCode: false, //是否正在获取验证码
      codeText: '获取验证码'
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'lotteryPlateDom'
    ])
  },
  methods: {
    ...mapMutations([
      'setUserInfo',
      'showDialog',
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
            // self.$toast({
            //   message: '网络状态不好～'
            // });
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
            !!res.content && self.setUserInfo({ //保存真正的信息
              ...res.content
            });
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
          // this.$toast({
          //   message: '网络状态不好～'
          // });
          console.log(`message: '网络状态不好～'`)
        });
      }
    } // end submitLogin
  } // end methods
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$input-color: #888888;
$input-border-color: #d4d4d4;
$code-bg-color: #4bb0e5;
$code-color: #fff;

  .e-login {

    .content {
        padding: 0;
    }

    .messages {
        padding: .44rem .24rem;
        min-height: 2.1rem;
    }

    .input-box {
        position: relative;

        & input {
            width: 100%;
            height: 0.76rem;
            padding-left: 0.3rem;
            font-size: 0.24rem;
            line-height: 0.76rem;
            color: $input-color;
            border-radius: 0.4rem;
            -webkit-appearance: none;
            outline:none;
            border: 1px solid $input-border-color;

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
            right: 0.1rem;
            transform: translateY(-50%);
            width: 1.9rem;
            height: .6rem;
            line-height: .6rem;
            color: $code-color;
            font-size: 0.24rem;
            background: $code-bg-color;
            text-align: center;
            border-radius: 0.3rem;

            &.e-disable {
                background: #ccc;
                pointer-events: none;
            }
        }
    }
}
</style>
