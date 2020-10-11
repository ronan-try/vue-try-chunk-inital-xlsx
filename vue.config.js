// 应该不需要terser，现在自带压缩了
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
