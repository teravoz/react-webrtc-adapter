/* global __dirname */

const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {

  return {
    mode: 'production',
    entry: path.resolve(path.resolve(__dirname, 'src'), 'index.js'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'index.js',
      library: ['react-webrtc-adapter'],
      libraryTarget: 'umd',
      publicPath: 'build'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties']
              }
            }
          ]
        }
      ]
    },
    stats: {
      colors: true
    },
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    performance: {
      hints: false,
    },
  };
};
