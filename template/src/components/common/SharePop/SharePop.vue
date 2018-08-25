<template>
  <div v-if="isShow" @click="!!close && close()" class="u-share-pop">
    <div class="animate-share"> 分享蒙层</div>
  </div>
</template>

<script>
export default {
  name: 'SharePop',
  props: ['isShow', 'close'],
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.u-share-pop{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 50;

  .animate-share {
    display: block;
    margin: 0.5rem auto;
    width: 5.8rem;
    animation: share-breath 1s ease infinite;
  }
}

@keyframes share-breath {
  from {
    transform: translateY(0%);
  }

  50% {
    transform: translateY(20%);
  }

  to {
     transform: translateY(0%);
  }
}
</style>
