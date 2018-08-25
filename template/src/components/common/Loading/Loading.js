/**
 * Loading
 * usage: this.$loading().show(); this.$loading().hide();
 */
import Loading from './Loading.vue'

let plugin = {},
  instance = null;
plugin.installed = false;

// 插件必须要有一个install方法
plugin.install = function (Vue, options = {}) {
  if (plugin.installed) return;
  //
  const LoadingController = Vue.extend(Loading);

  // 实现loading的关闭方法
  LoadingController.prototype.hide = function () {
    this.isVisible = false;
  }

  // 实现loading的展示方法
  LoadingController.prototype.show = function () {
    this.isVisible = true;
  }

  // 在Vue原型实现toast的DOM挂载、以及功能实现
  Vue.prototype.$loading = (option = {}) => {
    if (instance === null) {
      instance = new LoadingController().$mount(document.createElement('div'));
      document.body.appendChild(instance.$el);
      plugin.installed = true;
    }

    return instance;
  }
}

// 最后将以上内容导出，即可在其他地方进行使用
export default plugin;
