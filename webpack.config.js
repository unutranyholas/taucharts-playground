var path = require('path');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');
var nested = require('postcss-nested');
var precss = require('precss');
var color = require('postcss-color-function');

module.exports = {
  context: path.resolve(__dirname, "app"),
  entry: {
    javascript: "./index.js",
    html: "./index.html",
  },
  output: {
    filename: "index.js",
    path: __dirname + "/dist"
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
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
    ]
  },
  postcss:
    function () {
      return [autoprefixer, precss, color];
    }
};