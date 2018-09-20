<template>
  <Dialog :dialog="graphDialog" :closeDialog="closeGraphDialog">
    <div class="u-graph-box">
      <div class="input-graph-box">
        <input class="input-graph" maxlength="4"
        :value="inputGraph"
        @input="$emit('inputGraph', $event.target.value)"
        type="tel" placeholder="请输入图形验证码">
        <div @click="getGraphCode" class="img-graph"><img :src="graphSrc" alt=""></div>
        <a href="javascript:;" @click="getGraphCode" class="refresh-btn"></a>
      </div>
    </div>
  </Dialog>
</template>
<script>

// graphDialog: { //弹窗配置
//   isShow: true,
//   title: '请输入验证码',
//   footer: {
//     confirm: {
//       text: '确认',
//       callBack() {}
//     },
//     cancel: {
//       text: '取消'
//     }
//   }
// }
import { ACTIVE_NAME } from '@/constants/index'
import Dialog from '@/components/common/Dialog/Dialog';

export default {
  name: 'GraphCode',
  props: {
    inputGraph: String, //图形验证码
    graphDialog: Object, //弹窗配置
    closeGraphDialog: Function //关闭弹窗事件
  },
  data () {
    return {
      graphSrc: ''// 图形验证码图片路径
    }
  },
  components: {
    Dialog
  },
  mounted () {
    this.getGraphCode()
  },
  methods: {
    /**
     * 获取验证码
     */
    getGraphCode() {
      this.graphSrc = `/${ACTIVE_NAME}/Api/userGraphCode?${new Date().getTime()}`;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.u-graph-box {
  position: relative;
  min-height: 1.6rem;

  .tips {
    font-size: 0.28rem;
    color: #333;
    line-height: 0.32rem;
  }

  .input-graph-box {
    margin-top: 0.4rem;
    position: relative;
  }

  //图形验证码弹窗
  .input-graph {
    width: 2.6rem;
    height: 0.76rem;
    padding-left: 0.3rem;
    font-size: 0.24rem;
    line-height: 0.76rem;
    color: #888888;
    -webkit-appearance: none;
    outline: none;
    border: 1px solid #d4d4d4;
  }

  .img-graph {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%);
    width: 1.9rem;
    height: 100%;
    text-align: center;
    // border: 1px solid #ccc;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  .refresh-btn {
    position: absolute;
    top: 50%;
    right: -0.2rem;
    width: 0.4rem;
    height: 0.4rem;
    transform: translateY(-50%);
    background: url(./images/refresh.png) no-repeat;
    background-size: 100% 100%;
  }
}
</style>
