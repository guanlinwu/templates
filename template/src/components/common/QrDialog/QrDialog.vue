
<template>
  <Dialog :dialog="qrDialog">
    <p class="qrcode-tips">长按识别或扫描以下二维码关注茂名移动公众号</p>
    <img class="img-qrcode" src="./images/qrcode.jpg" alt="">
  </Dialog>
</template>

<script>
import Dialog from '@/components/common/Dialog/Dialog';

export default {
  name: 'QrDialog',
  props: {
    qrDialog: Object
  },
  data () {
    return {

    }
  },
  components: {
    Dialog
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
