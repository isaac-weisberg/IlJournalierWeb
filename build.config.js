const path = require('path');
const fs = require('fs')
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')

module.exports = {
  entry: {
    'build': './src/index.ts'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        type: 'asset/resource'
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
        { from: "./src/index.html" },
      ],
    }),
    new webpack.EnvironmentPlugin(['ILJOURNALIER_SERVER_HOST']),
    new webpack.EnvironmentPlugin(['APP_VERSION']),
  ],
  devServer: {
    server: {
      type: 'https',
      options: {
        key: './localhost-key.pem',
        cert: './localhost.pem'
      }
    },
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 9000,
  }
};