'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const ACTIVE_NAME = config.ACTIVE_NAME,
  LOCAL_FILE_NAME = config.LOCAL_FILE_NAME,
  DEV_LOCAL_FILE_NAME = config.DEV_LOCAL_FILE_NAME,
  RESULT_LOCAL_FILE_NAME = process.argv.includes('--test') ? DEV_LOCAL_FILE_NAME : LOCAL_FILE_NAME, //如果是上传到测试服务器则为true
  productDomain = 'http://wx.gdmmyd.net', //正式环境
  testDomain = 'http://39.108.189.243', //测试环境
  domain = process.argv.includes('--test') ? 'http://39.108.189.243' : 'http://wx.gdmmyd.net',
  isAll = process.argv.includes('--all'),
  isPushToGitLocal = config.isPushToGitLocal;

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    /**
     * copy文件到git仓库
     */
    if (isPushToGitLocal) {
      if (isAll) {
        console.log(chalk.cyan('  Copy files to product server & test server.\n'))
        pushToGitLocal(LOCAL_FILE_NAME, productDomain, ACTIVE_NAME);
        pushToGitLocal(DEV_LOCAL_FILE_NAME, testDomain, ACTIVE_NAME);
      } else {
        pushToGitLocal(RESULT_LOCAL_FILE_NAME, domain, ACTIVE_NAME);
      }
    }
  })
});

const pushToGitLocal = (RESULT_LOCAL_FILE_NAME, domain, ACTIVE_NAME)=> {
  rm(path.join(RESULT_LOCAL_FILE_NAME, ACTIVE_NAME), err => { //移除本地活动目录的该活动文件，然后把刚刚生成的新活动文件复制到本地活动目录
    if (err) {
      console.log(chalk.red('  Remove files in Actives failed with errors.\n'))
      throw err
    }
    console.log(chalk.green('  GuanLinWu: Has remove old files in ' + RESULT_LOCAL_FILE_NAME + '\n'))
    fse.copy(path.resolve(__dirname, `../dist`), RESULT_LOCAL_FILE_NAME)
      .then(() => {
        console.log(chalk.green(`  Has copy files to Actives, and you can git push it to server, \n  then access it from`
        +  chalk.cyan(`  ${domain}/actives/${ACTIVE_NAME}/index.html \n`)))
      })
      .catch(err => {
        console.error(err);
        console.log(chalk.red('  Copy files to Actives failed with errors.\n'))
      });
  });
}
