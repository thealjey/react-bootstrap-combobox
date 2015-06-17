var path = require('path'),
    nodeJS = require('webcompiler').nodeJS,
    NativeProcess = require('webcompiler/build/NativeProcess')

/*eslint-disable one-var*/
var rootDir = path.join(__dirname, '..'),
    buildDir = path.join(rootDir, 'build');

/*eslint-enable one-var*/

nodeJS('lib/Combo.js', 'build/Combo.js', function compiled() {
  (new NativeProcess(path.join(rootDir, 'node_modules', '.bin', 'jsdoc'))).run(Function.prototype, [
    buildDir,
    '-d', path.join(rootDir, 'docs'),
    '-P', path.join(rootDir, 'package.json'),
    '-R', path.join(rootDir, 'README.md')
  ]);
});
