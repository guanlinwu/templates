'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const ACTIVE_NAME = 'templateVue'; //设置活动名称
const SERVE_FILE_NAME = 'actives'; //服务器的文件存放目录
const LOCAL_FILE_NAME = '/Users/wuguanlin/Desktop/Total/CMCC/Active'; //本地活动的文件存放目录
const DEV_LOCAL_FILE_NAME = '/Users/wuguanlin/Desktop/Total/CMCC/TestActive'; //本地活动的文件存放目录

module.exports = {
  ACTIVE_NAME,
  SERVE_FILE_NAME,
  LOCAL_FILE_NAME,
  DEV_LOCAL_FILE_NAME,
  isPushToGitLocal: false,
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    // assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, `../dist/${ACTIVE_NAME}/index.html`),

    // Paths
    assetsRoot: path.resolve(__dirname, `../dist/${ACTIVE_NAME}`),
    assetsSubDirectory: `static`,
    assetsPublicPath: `/${SERVE_FILE_NAME}/${ACTIVE_NAME}/`, //之所以要static, 是因为服务器文件夹叫static
    // assetsPublicPath: `/`, //之所以要static, 是因为服务器文件夹叫static

    /**
     * Source Maps
     */

    productionSourceMap: false, //特意取消
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
