module.exports = (api, opts, rootOptions) => {
  // 暂时不支持多语言
  opts.lang = 'en'
  // opts.import = 'full' // full/partial
  // opts.customTheme = false // true /false

  const utils = require('./utils')(api)

  api.extendPackage({
    dependencies: {
      'element3': '^0.0.26'
    }
  })

  api.injectImports(api.entryFile, `import installElement3 from './plugins/element.js'`)

  api.render({
    './src/plugins/element.js': './templates/src/plugins/element.js.ejs',
    './src/App.vue': './templates/src/App.vue.ejs'
  })

  if (opts.import === 'partial') {
    // 暂不支持css分包
    // api.extendPackage({
    //   devDependencies: {
    //     'babel-plugin-component': '^1.1.1'
    //   }
    // })
  } else if (opts.customTheme) {
    api.render({
      './src/element-variables.scss': './templates/src/element-variables.scss.ejs'
    })
    api.extendPackage({
      devDependencies: {
        'sass-loader': '^10.0.4',
        'sass': '^1.27.0'
      }
    })
  }

  api.afterInvoke(() => {
    const { EOL } = require('os')
    const fs = require('fs')
    const contentMain = fs.readFileSync(api.resolve(api.entryFile), { encoding: 'utf-8' })
    const lines = contentMain.split(/\r?\n/g)

    const renderIndex = lines.findIndex(line => line.match(/createApp\(App\)\.mount\('#app'\)/))
    lines[renderIndex] = `const app = createApp(App)`
    lines[renderIndex + 1] = `installElement3(app)`
    lines[renderIndex + 2] = `app.mount('#app')`

    fs.writeFileSync(api.resolve(api.entryFile), lines.join(EOL), { encoding: 'utf-8' })
  })

  api.onCreateComplete(() => {
    // 暂不支持按需加载
    // if (opts.import === 'partial') {
    //   utils.updateBabelConfig(cfg => {
    //     const pluginComponent = ['component', {
    //       'libraryName': 'element3',
    //       'styleLibraryName': 'theme-chalk'
    //     }]
    //     cfg.plugins = cfg.plugins || []
    //     cfg.plugins.push(pluginComponent)
    //     return cfg
    //   })
    // }
  })
}
