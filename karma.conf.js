var path = require('path');
var webpack = require('webpack');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'js/spec/**/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'js/spec/**/*Spec.js': ['webpack']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,


    webpack: {
      resolve: {
        root: [
          path.resolve('.'),
          path.resolve('./js'),
          path.resolve('./js/spec')
        ]
      },
      devtools: 'inline-source-map',
      module: {
        loaders: [{
          test: /\.js/,
          loader: 'babel',
          exclude: /node_modules/
        }]
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          minimize: true,
          'screw-ie8': true,
          mangle: true,
          compress: {
            warnings: true
          },
          output: {
            comments: false,
            semicolons: true
          }
        }),
        new webpack.optimize.DedupePlugin()
      ]
    }
  });
};
