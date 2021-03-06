const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },

  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue.js project',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author',
    },
    templateType: {
        when: 'isNotTest',
        type: 'list',
        message: 'SinglePage or MultiPage?',
        choices: [
            {
                name: 'Yes, use SinglePage',
                value: 'SinglePage',
                short: 'SinglePage'
            },
            {
                name: 'Yes, use MultiPage',
                value: 'MultiPage',
                short: 'MultiPage'
            }
        ]
    },
    autoInstall: {
        when: 'isNotTest',
        type: 'list',
        message: 'Install npm package after the project has been created?',
        choices: [
            {
              name: 'Yes, use NPM',
              value: 'npm',
              short: 'npm'
            },
            {
              name: 'Yes, use Yarn',
              value: 'yarn',
              short: 'yarn'
            },
            {
              name: 'No, I will handle that myself',
              value: false,
              short: 'no'
            }
        ]
    }
  },
  filters: {
    'index.html'     : "templateType === 'SinglePage'",
    'src/router/**/*': "templateType === 'SinglePage'",
    'src/store/**/*' : "templateType === 'SinglePage'",
    'src/App.vue'    : "templateType === 'SinglePage'",
    'src/index.js'   : "templateType === 'SinglePage'",
    'src/views/**/*' : "templateType === 'SinglePage'",
    'src/pages/**/*' : "templateType === 'MultiPage'"
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
