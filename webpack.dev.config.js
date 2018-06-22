const defaultConfig = require('./webpack.config');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  ...defaultConfig,
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: (defaultConfig.plugins || []).concat([
    new WebpackShellPlugin({
      onBuildEnd: ['cp -a ./public/. ./build/'],
      // Force the scripts to run every time there is an update,
      // instead of just the first time.
      dev: false,
    })
  ]),
};
