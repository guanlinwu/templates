<template>
  <footer class="m-footer">
    <div class="line hardline"></div>
    <img class="logo" src="@/assets/images/footer_logo.png" alt="中国移动">
    <p class="record-number">粤ICP备09183520号-6</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$-footer-line-color: #4bb0e6; //细线颜色
$-number-color: #4bb0e6; //备案号文本颜色

.m-footer {
  padding: 0 0.6rem 0.12rem;
  background: #fff;

  .line::before {
      border-top-color: $-footer-line-color;
  }

  .logo {
      width: 1.82rem;
      height: 0.74rem;
      margin: 0 auto 0;
  }

  .record-number {
      text-align: center;
      text-indent: 0.16rem;
      font-size: 0.14rem;
      color: $-number-color;
      line-height: 1;
  }
}
</style>
