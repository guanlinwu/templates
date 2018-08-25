<template>
    <transition name='fade'>
      <section v-show='isVisible' :class='position' class='toast'>
        <span class="message">\{{message}}</span>
      </section>
    </transition>
</template>

<script>
export default {
  data () {
    return {
      isVisible : false,
      message : '',
      position: ''
    };
  }
}
</script>


<style lang="scss" scoped>

$toast-text-color: #fff; //文本颜色
$toast-theme-color: #4f4f4f; //背景和阴影颜色

.toast {
    position: fixed;
    left: 50%;
    transform:translate(-50%,-50%) scale(1);
    width: 100%;
    height: 0.8rem;

    font-size: 0;
    text-align: center;

    border-radius: .5rem;
    z-index: 9999;

    > .message {
      display: inline-block;
      max-width: 92%;
      padding: 0 0.32rem;
      font-size: 0.24rem;
      line-height: 0.8rem;
      color: $toast-text-color;
      word-wrap: break-word;

      box-shadow: 0 2px 6px $toast-theme-color;
      border-radius: .5rem;
      background: $toast-theme-color;
    }
}
.toast.middle{
    top:45%;
}
.toast.top{
    top:10%;
}
.toast.bottom{
    top:90%;
}
.fade-enter-active, .fade-leave-active {
  transition: transform .5s
}
.fade-enter, .fade-leave-active {
  transform:translate(-50%,-50%) scale(0);
}
</style>
