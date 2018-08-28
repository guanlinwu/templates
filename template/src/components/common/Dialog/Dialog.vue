<template>
  <transition name='f-fade'>
    <div class="dialog" @click.self.stop="!dialog.preventMaskClose && !!closeDialog && closeDialog()" v-show="dialog.isShow">
      <div class="content">
          <header v-if="!!dialog.title && dialog.title !== ''" class="title">\{{dialog.title}}</header>
          <div class="messages hardline">
              <slot>
                <div v-html="dialog.message"></div>
              </slot>
          </div>
          <div v-if="dialog.isShowFooter" name="footer" class="dialog-footer">
            <slot name="footer">
              <a v-for="(item, index) in dialog.footer" :key="`btn-${index}`" @click="!!item.callBack ? item.callBack() : closeDialog()" class="btn hardline" href="javascript:;" v-html="item.text"></a>
            </slot>
          </div>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * useage
 *
 * 方法一：
<Dialog :dialog="dialog">
  自定义的内容dom
  <div slot="footer">
    自定义按钮的dom以及事件
  </div>
</Dialog>

 * 方法二：
 *  传入dialog属性，如果有slot，则优先显示方法一的slot内容
 * dialog: { //对话框的基本信息
      title: '444',
      message: '222',
      isShow: false,
      footer: {
        confirm: {
          text: '确认',
          callBack: function() {} //点击按钮的回调事件
        },
        cancel: {
          text: '取消',
          callBack: function () { }
        }
      }
    }，
    closeDialog //关闭弹窗的事件

  * 调用vuex的事件
  *
  * 显示对话弹框
  *
  * @param {any} opts
  showDialog(opts) {
    state.dialog = {
      ...opts,
      isShow: true
    }
  },
  * 隐藏对话弹框
  closeDialog() {
    state.dialog.isShow = false;
  }
*/

export default {
  name: 'Dialog',
  props: {
    dialog: Object, //对话框的基本信息
    closeDialog: Function //关闭弹窗的事件
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$text-color: #4bb0e5; //弹窗文本颜色
$footer-bg-color: #4bb0e5; //底部按钮背景颜色

$footer-text-first-color: #fff; //第一个按钮的文本颜色
$footer-bg-first-color: #4bb0e5; //第一个按钮的背景颜色

$footer-text-last-color: #4bb0e5; //第二个按钮的文本颜色
$footer-bg-last-color: #fff; //第二个按钮的背景颜色

.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 30;

    .title {
        margin-top: 0.44rem;
        position: relative;
        font-size: 0.34rem;
        color: $text-color;
        line-height: 1;
        text-align: center;

        &::before, &::after {
            content:'';
            position:absolute;
            top:50%;
            transform-origin: 0 0;
            border-top:1px solid  $text-color;
            pointer-events:none;
            width: .68rem;
            transform: translateY(-50%) scaleY(.5);
        }
        &::before {
            left: 9%;
        }
        &::after {
            right: 9%;
        }
    }

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6rem;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 0.1rem;
        overflow: hidden;
    }

    .messages {
        padding: 0.44rem .5rem .1rem;
        min-height: 1.8rem;
        text-align: left;
        font-size: 0.24rem;
        color: inherit;

        &::before {
            border-bottom-color: $footer-bg-color;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        background: $footer-bg-color;

        > .btn {
            flex: 1;
            height: 0.9rem;
            line-height: 0.9rem;
            font-size: 0.28rem;
            text-align: center;

            &:first-child {
              color: $footer-text-first-color;
              background-color: $footer-bg-first-color;
            }

            &:nth-child(2) {
              color: $footer-text-last-color;
              background-color: $footer-bg-last-color;
            }

            &:not(:first-child)::before {
                border-left-color: #dbdbdf;
            }
        }
    }
}
</style>
