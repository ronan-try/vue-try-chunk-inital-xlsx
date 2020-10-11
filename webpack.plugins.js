const mustPlugins = [];

// lodash-webpack-plugin
// {
//   const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
//   mustPlugins.push(new LodashModuleReplacementPlugin());
// }

const optionalPlugins = [];

// webpack-bundle-analyzer
{
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  'ANALYZE_JS' in process.env && optionalPlugins.push(new BundleAnalyzerPlugin());
}

const plugins = [...mustPlugins, ...optionalPlugins];
module.exports = plugins;
