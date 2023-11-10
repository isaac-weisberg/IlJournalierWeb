const path = require('path');
const fs = require('fs')
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')

module.exports = {
  entry: {
    'service-worker': './pwa-support/service-worker.ts'
  },
  target: 'web',
  mode: process.env.MODE,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./pwa-support/manifest.json" },
        { from: "./pwa-support/iljourn-ico144x144.jpg" },
        { from: "./pwa-support/iljourn-ico144x144.svg" },
      ],
    }),
    new webpack.EnvironmentPlugin(['APP_VERSION'])
  ]
};