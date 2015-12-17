module.exports = function(please) {
  var createConfig = require('./webpack.config.creator');
  var config = createConfig(please);

  var remove = require('rimraf');
  remove.sync(config.output.path);
  var fs = require('fs-extra');
  fs.mkdirsSync(config.output.path);

  var webpack = require('webpack');
  var compiler = webpack(config);
  compiler.run(function(err, stats) {
    if (err) {
      throw err;
    }
    console.log(stats.toString(require('./webpack.stats.console')));
    var jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      throw new Error('there are compilation errors');
    }
  });
};