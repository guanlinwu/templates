<template>
  <div class="u-scratch">
    <div class="u-scratch-box">
      <!-- <canvas id="scratchCardCanvas" @touchstart.stop.prevent="scratchCard.touchStart($event)" width="300" height="300" style="background: #222"> -->
      <transition v-if="isShowCanvas" name='f-fade'>
        <canvas class="scratch-canvas" id="scratchCardCanvas" width="260" height="100">
          Canvas not supported
        </canvas>
      </transition>
    </div>
  </div>
</template>

<script>
import ScratchCard from '@/scripts/modules/ScratchCard';

export default {
  name: 'Test',
  data () {
    return {
      scratchCard: {},
      isShowCanvas: true
    }
  },
  mounted () {
    this.scratchCard = new ScratchCard('#scratchCardCanvas', {
      fadeOutClass: 'e-fadeout',
      onceTouchCall() {
        console.log('已经开始刮了，可以发送请求');
      },
      resultCall() {
        console.log('刮卡完毕，可以弹窗交互了');
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .u-scratch-box {
    padding: .4rem 0;
    .scratch-canvas {
      transition: all .5s ease;

      &.e-fadeout {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
</style>
