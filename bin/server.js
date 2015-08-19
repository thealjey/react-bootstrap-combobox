/* @flow */

/* @noflow */
import {DevServer} from 'webcompiler';
import {join} from 'path';

var rootDir = join(__dirname, '..'),
    devDir = join(rootDir, 'development'),
    server = new DevServer(join(devDir, 'script.js'), join(devDir, 'app.scss'), devDir);

server.run(rootDir, 'bin', 'build', 'docs', 'lib', 'node_modules', 'spec');
