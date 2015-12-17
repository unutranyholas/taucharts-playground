var path = require('path');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');
var nested = require('postcss-nested');
var precss = require('precss');
var color = require('postcss-color-function');
var magician = require('postcss-font-magician');
var _ = require('lodash');

var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var HtmlPlugin = require('html-webpack-plugin');
var toAbsolute = function (relativePath) {
  return path.resolve(__dirname, relativePath);
};

module.exports = please => ({
  context: toAbsolute("app"),
  entry: {
    index: "./index.js"
  },
  output: {
    filename: "[name].js",
    path: toAbsolute("dist")
  },
  resolve: {
    alias: {
      'tauCharts': toAbsolute('node_modules/tauCharts/build/development/tauCharts'),
      'tauCharts-tooltip': toAbsolute('node_modules/tauCharts/build/development/plugins/tauCharts.tooltip'),
      'tauCharts-legend': toAbsolute('node_modules/tauCharts/build/development/plugins/tauCharts.legend'),
      'tauCharts-trendline': toAbsolute('node_modules/tauCharts/build/development/plugins/tauCharts.trendline'),
      'tauCharts-export': toAbsolute('node_modules/tauCharts/build/development/plugins/tauCharts.export'),
      'tauCharts-quick-filter': toAbsolute('node_modules/tauCharts/build/development/plugins/tauCharts.quick-filter'),
      'tauCharts-annotations': toAbsolute('node_modules/tauCharts/build/development/plugins/tauCharts.annotations')
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer, precss, color, magician];
  },
  plugins: _.compact([
    please.minify && new UglifyJsPlugin(),
    new ProgressPlugin((percent, message) => console.log(`${(100 * percent).toFixed(1)}% ${message}`)),
    new HtmlPlugin()
  ])
});