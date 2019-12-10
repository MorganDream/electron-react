const path = require('path');
const webpack = require('webpack');
const { spawn } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { PORT, webpackConfig } = require('./base');
const getDefaultModules = require('./webpack-loader');

const config = Object.assign({}, webpackConfig, {
  entry: {
    index: [
      './render/index',
    ],
  },
  output: Object.assign(webpackConfig.output, {
    path: path.join(process.cwd(), 'build'),
    publicPath: `http://localhost:${PORT}/`,
  }),
  devServer: {
    contentBase: './build/',
    historyApiFallback: true,
    hot: true,
    port: PORT,
    noInfo: false,
    stats: {
      colors: true,
    },
    before() {
      spawn(
        'electron',
        ['.'],
        {
          shell: true,
          env: Object.assign({
            PORT,
          }, process.env),
          stdio: 'inherit',
        }
      )
        .on('close', () => process.exit(0))
        .on('error', spawnError => console.error(spawnError));

      spawn(
          'dotnet',
          ['./neo-cli/neo-cli.dll'],
          {
            shell: true,
            env: Object.assign({
              PORT: 4000,
            }, process.env),
            stdio: 'inherit',
          }
        )
          .on('message', message => console.log(`From CLI: ${message}`))
          .on('close', () => process.exit(0))
          .on('error', spawnError => console.error(spawnError));
    },
  },
  cache: true,
  devtool: 'eval-source-map',
  module: getDefaultModules(),
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'render/public/template/index.html',
      chunks: ['index'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

config.module.rules.push({
  test: /\.js$/,
  use: [
    'babel-loader',
    path.resolve(__dirname, './lazyLoader.js'),
  ],
  include: [
    path.join(process.cwd(), 'render'),
  ],
});

module.exports = config;
