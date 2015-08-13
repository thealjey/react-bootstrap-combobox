/* @flow */

/* @noflow */
import {SASS} from 'webcompiler';

/* @noflow */
import {DirectoryWatcher} from 'simple-recursive-watch';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import {join} from 'path';
import tinylr from 'tiny-lr';

var rootDir = join(__dirname, '..'),
    compiler = new SASS(),
    lr = tinylr(),
    devDir = join(rootDir, 'development'),
    inPath = join(devDir, 'script.js'),
    webSASS = compiler.feDev.bind(compiler,
      join(devDir, 'app.scss'),
      join(devDir, 'style.css'),
      function () {
        lr.changed({body: {files: ['style.css']}});
      });

lr.listen(35729);
webSASS();
DirectoryWatcher.watch(rootDir, 'scss', webSASS, 'bin', 'build', 'docs',
                       'lib', 'node_modules', 'spec');

new WebpackDevServer(webpack({
  cache: {},
  debug: true,
  devtool: 'eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    inPath
  ],
  output: {
    path: devDir,
    filename: 'script.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel-loader']
    }]
  }
}), {
  contentBase: devDir,
  publicPath: '/',
  hot: true,
  historyApiFallback: true
}).listen(3000, '0.0.0.0', function (e) {
  if (e) {
    return console.error(e);
  }
  console.log('Listening at localhost:3000');
});
