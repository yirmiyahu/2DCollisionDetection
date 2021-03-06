import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';
import webpack from 'webpack';

export default {
  entry: './js/bootstrap.js',
  output: {
    path: './dist',
    filename: './assets/js/bootstrap.js'
  },
  resolve: {
    root: [
      path.resolve('.'),
      path.resolve('./js')
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      loader: ExtractTextWebpackPlugin.extract('style-loader', 'css-loader!postcss-loader')
    }]
  },
  postcss() {
    return [autoprefixer];
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: '2D Collision Detection',
      template: './index.html',
      inlineSource: '.(js|css)$',
      inject: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new ExtractTextWebpackPlugin('./assets/css/styles.css'),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: true,
      output: {
        comments: false,
        semicolons: true
      }
    }),
    new webpack.optimize.DedupePlugin()
  ]
};
