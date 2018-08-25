<template>
  <div class="u-text-carousel" v-if="!!textCarousel && textCarousel.length > 0">
    <ul class="scroll-list" :style="scrollStyle">
      <li class="scroll-item" v-for="(item, index) in textCarousel" :key="index">
        <a :href="item.href">\{{item.text}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TextCarousel',
  props: [
    'textCarousel'
  ],
  data() {
    return {
      scrollContainerHeight: 48, //在750px设计稿下的高度
      scrollStyle: ''
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.initScroll();
    });
  },
  methods: {
    /**
     * 初始化轮播
    */
    initScroll() {
      let self = this,
        length = this.textCarousel.length; //实际记录，多的那条是放在最后的
      if (length <= 0) {
        return;
      }
      let windowWidth = window.innerWidth,
        ITEMHEIGHT = (self.scrollContainerHeight * windowWidth) / 750,
        loop = 1;

      scrollUp();

      /**
       * 轮播
       */
      function scrollUp() {
        if (loop < length) {
          self.scrollStyle = `transition: all .5s ease-in; -webkit-transition: all .5s ease-in;transform: translateY(-${loop * ITEMHEIGHT}px);-webkit-transform: translateY(-${loop * ITEMHEIGHT}px);`;
          loop++;
          setTimeout(scrollUp, 3000);
        } else {
          self.scrollStyle = `transition: none; -webkit-transition: none;transform: translateY(0px);-webkit-transform: translateY(0px);`;
          loop = 1;
          setTimeout(scrollUp, 500);
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.u-text-carousel {
  margin: 0 auto;
  width: 5.08rem;
  height: 0.48rem;
  background: url(../../../assets/images/text_carousel_bg.png) no-repeat;
  background-size: 100% 100%;
  overflow: hidden;

  .scroll-list {
    padding-left: 0.44rem;
    transition: all 1s ease;

    .scroll-item {
      font-size: 0.2rem;
      color: #ffc715;
      line-height: 0.48rem;

      > a {
        color: #ffc715;
      }
    }
  }
}
</style>
