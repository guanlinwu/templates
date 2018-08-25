<template>
  <div class="page-index">
    页面
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

// import Api from '@/api';

export default {
  name: 'Index',
  data() {
    return {

    }
  },
  components: {
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  created() {
  },
  methods: {
    ...mapMutations([
      'setUserInfo',
      'toggleLogin',
      'showDialog',
      'closeDialog'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
