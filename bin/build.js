/* @flow */

import {JS, NativeProcess, SASSLint} from 'webcompiler';
import {join} from 'path';
import {createReadStream, createWriteStream} from 'fs';

const rootDir = join(__dirname, '..'),
    binDir = join(rootDir, 'bin'),
    buildDir = join(rootDir, 'build'),
    libDir = join(rootDir, 'lib'),
    devDir = join(rootDir, 'development'),
    docsDir = join(rootDir, 'docs'),
    specDir = join(rootDir, 'spec'),
    modulesDir = join(rootDir, 'node_modules'),
    readme = join(rootDir, 'README.md'),
    jsdocConfig = join(modulesDir, 'webcompiler', 'config', 'jsdoc.json'),
    style = join(rootDir, '_index.scss'),
    devStyle = join(devDir, 'app.scss'),
    js = new JS(),
    jsdoc = new NativeProcess(join(modulesDir, '.bin', 'jsdoc')),
    npm = new NativeProcess('npm');

new SASSLint().run([style, devStyle], function () {
  js.beDir(libDir, buildDir, function () {
    jsdoc.run(function (e) {
      if (e) {
        return console.error(e);
      }
      createReadStream(join(rootDir, 'LICENSE')).pipe(createWriteStream(join(docsDir, 'LICENSE')));
      createReadStream(join(rootDir, 'doc_readme.md')).pipe(createWriteStream(join(docsDir, 'README.md')));
      console.log('\x1b[32mGenerated API documentation!\x1b[0m');
      npm.run(Function.prototype, ['test'], {stdio: 'inherit'});
    }, [buildDir, '-d', docsDir, '-R', readme, '-c', jsdocConfig]);
  }, specDir, binDir, devDir);
});
