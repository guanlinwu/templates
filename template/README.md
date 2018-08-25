# 基于vue的前端多页面脚手架

> A Vue.js project
> author: guanlinwu

## Build Setup

``` bash
# install dependencies
$ yarn install
#or
$ npm install

# serve with hot reload at localhost:8080
$ yarn dev
#or
$ npm run dev

# build for production with minification 正式服务器
$ yarn build
#or
$ npm run build

# build for development with minification 测试服务器
$ yarn buildTest
#or
$ npm run buildTest

# build for production and view the bundle analyzer report
$ yarn build --report

# 如果是抓包调试模式，每次修改都自动生成文件在dist目录
yarn watch
```
## 关于yarn build或者npm run build
执行命令后，在dist目录生成构建生产环境的文件后，会把生成的文件迁移到本地的一个git仓库(默认设置的是actives，需要根据实际情况修改)，然后再手动切换到git仓库去部署。
- 如果不需要自动部署，则可以去config目录下的index.js，找到isPushToGitLocal设置为false(默认是false)
- 如果需要，则去config目录下的index.js，设置下LOCAL_FILE_NAME的路径，指向本地的git仓库。

## 引用快捷复制
```javascript
//引用api
import  Api  from '@/api';

//引用vuex
import { mapState, mapMutations } from 'vuex';
computed: {
  ...mapState([
    'dialog',
    'isShowLogin'
  ])
},
methods: {
  ...mapMutations([
    'closeDialog'
  ])
}

//引用loading
this.$loading().show();
this.$loading().hide();
```

## 目录结构
```bash
---- backup-lib                                         //备用的一些库
---- build                                              //webpack构建
---- config                                             //工程化构建配置
---- src                                                //代码源
        ---- api                                        //接口
        ---- assets                                     //图片，字体
        ---- components                                 //组件
              ---- business                             //业务的组件，更改比较大
              ---- common                               //公共组件
              ---- base.vue                             //基础vue代码片段，便于新建文件，复制粘贴
        ---- constants                                  //常量
        ---- pages                                      //页面
              ---- $pageName                            //$pageName 文件目录名
                    ---- store                          //store，vuex的store
                    ---- App.vue                        //页面app应用入口
                    ---- $pageName.html                 //页面的基础html
                    ---- $pageName.js                   //js入口
        ---- router                                     //路由（暂时没用）
        ---- scripts                                    //js
              ---- lib                                  //模块的js库
              ---- modules                              //模块的js库
              Public.js                                 //封装常用的公共函数
        ---- styles                                     //样式
---- static                                             //静态文件
---- package.json                                       //npm 包文件
---- README.md                                          //It is me!
```

## 常用组件使用方法
- toast
```javascript
//options @see @src/components/common/toast
this.$toast(options);
```
- loading
```javascript
//@see @src/components/common/loading
this.$loading().show();
this.$loading().hide();
```
