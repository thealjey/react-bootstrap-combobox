/* @flow */

import {JS, NativeProcess, SASSLint} from 'webcompiler';
import {join} from 'path';

var rootDir = join(__dirname, '..'),
    binDir = join(rootDir, 'bin'),
    buildDir = join(rootDir, 'build'),
    libDir = join(rootDir, 'lib'),
    devDir = join(rootDir, 'development'),
    docsDir = join(rootDir, 'docs'),
    specDir = join(rootDir, 'spec'),
    readme = join(rootDir, 'README.md'),
    style = join(rootDir, '_index.scss'),
    devStyle = join(devDir, 'app.scss'),
    js = new JS(),
    jsdoc = new NativeProcess(join(rootDir, 'node_modules', '.bin', 'jsdoc'));

new SASSLint().run([style, devStyle], function () {
  js.beDir(libDir, buildDir, function () {
    jsdoc.run(function (e) {
      if (e) {
        return console.error(e);
      }
      console.log('\x1b[32mGenerated API documentation!\x1b[0m');
    }, [buildDir, '-d', docsDir, '-R', readme]);
  }, specDir, binDir, devDir);
});
