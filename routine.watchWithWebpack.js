var WATCHER_SERVER_LISTENING_PORT = 8080;

var path = require('path');

var extractModuleName = function(module) {
  if (module.resource) {
    var parts = module.resource.split(path.sep);
    return parts[parts.length - 1];
  }
  if (module.regExp) {
    return module.regExp;
  }
  return 'unknown module';
};

module.exports = function(please) {
  var createConfig = require('./webpack.config.creator');
  var config = createConfig(please);

  var remove = require('rimraf');
  remove.sync(config.output.path);
  var fs = require('fs-extra');
  fs.mkdirsSync(config.output.path);

  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');

  var compiler = webpack(config);
  compiler.plugin('invalid', function(invalidDependencies) {
    if (invalidDependencies) {
      console.log(JSON.stringify(invalidDependencies, null, 4));
    }
  });

  var compilationId = 0;
  compiler.plugin('compilation', function(compilation) {
    if (compilation.compiler.isChild()) {
      return;
    }
    ++compilationId;
    if (compilationId === 1) {
      return;
    }

    compilation.plugin('build-module', function(module) {
      console.log('...', extractModuleName(module));
    });
    compilation.plugin('succeed-module', function(module) {
      console.log(' OK', extractModuleName(module));
    });
    compilation.plugin('failed-module', function(module) {
      console.error('ERR', extractModuleName(module));
    });
  });

  compiler.plugin('done', function(stats) {
    process.title = stats.hasErrors() ? '╯°□°）╯' : ':)';
  });

  var server = new WebpackDevServer(compiler, {
    contentBase: 'non-existing-dir',
    watchOptions: {
      aggregateTimeout: 200,
      poll: false
    },
    stats: require('./webpack.stats.console'),
    historyApiFallback: false
  });

  server.listen(WATCHER_SERVER_LISTENING_PORT);
};