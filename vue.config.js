// optimization.minimize: true，使用的就是TerserPlugin
// const TerserPlugin = require('terser-webpack-plugin');

const plugins = require('./webpack.plugins');
const rules = require('./webpack.module.rules');

module.exports = {
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/theme.scss";'
      }
    }
  },
  configureWebpack: {
    // mode: 'production',
    mode: 'development',
    optimization: {
      usedExports: true,
      // minimize: true,
      // minimizer: [
      //   new TerserPlugin()
      // ]
    },
    plugins,
    module: {
      rules
    },
  }
};
