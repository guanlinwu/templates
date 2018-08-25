import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: function (resolve) {
        require(['@/views/index/index.vue'], resolve)
      }
    },
    {
      path: '/detail',
      name: 'detail',
      component: function (resolve) {
        require(['@/views/detail/index.vue'], resolve)
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
