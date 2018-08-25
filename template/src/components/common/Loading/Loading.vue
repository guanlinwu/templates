<template>
  <transition name='f-fade'>
    <section class="u-loading" v-show='isVisible'>
        <div class="spinner">
          <img src="./images/loading.gif" alt="">
        </div>
    </section>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      isVisible: false
    };
  }
}
</script>


<style lang="scss" scoped>
.u-loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 40;
}
.spinner {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
}
</style>
