// Strict mode
'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const webpack = require('webpack')
const path = require('path')
module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build-[name]--[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
/*      Vel: 'velocity-animate',
      $: 'jQuery',
      jQuery: 'jQuery' */
    }),
    new webpack.optimize.CommonsChunkPlugin(
      {
        name: 'vendor',
        filename: 'vendor.bundle.js'
      }
    ),
    new webpack.optimize.CommonsChunkPlugin({
      children: true
    }),
    new CopyWebpackPlugin([
      { from: './src/static' }
    ]),
    new ExtractTextPlugin("styles.css")
 /*   new DashboardPlugin({ port: 8088 }) */
  ],
  devtool: "inline-source-map",
  devServer: { inline: true },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary 
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.woff2{0,1}$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.js?$/,
        include: '/_js/',
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.vue?$/,
        loader: 'vue-loader'
      }
    ]
  }
}