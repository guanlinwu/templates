<template>
  <div class="u-smart-canvas">
    <canvas id="smartCanvas" class="smart-canvas"></canvas>
    <div class="smart-canvas-container">
      <img class="prew-img" v-if="imgSrc" :src="imgSrc" alt="">
    </div>
  </div>
</template>

<script>
import SmartCanvas from '@/scripts/modules/SmartCanvas';
export default {
  name: 'SmartCanvas',
  data() {
    return {
      SmartCanvasObj: null,
      imgSrc: ''
    }
  },
  async mounted() {
    this.SmartCanvasObj = new SmartCanvas('#smartCanvas');

    await this.SmartCanvasObj.drawGroupImages([
      {
        src: '/static/images/qrcode.jpg',
        x: 240,
        y: 500
      },
      {
        src: '/static/images/sharepic.jpg',
        x: 240,
        y: 100,
        drawWidth: 200,
        drawHeight: 200
      },
      {
        src: '/static/images/sharepic.jpg',
        x: 240,
        y: 500,
        drawWidth: 200,
        drawHeight: 200
      }
    ]);

    this.imgSrc = this.SmartCanvasObj.exportImage();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.smart-canvas {
  width: 100%;
  // display: none;
}
.prew-img {
  pointer-events: auto;
}
</style>
