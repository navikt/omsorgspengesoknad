const path = require('path');
const process = require('process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack/webpack.config.dev');

const configureDevServer = require('../webpack/devserver.config');
const createEnvSettingsFile = require('./envSettings');

require('dotenv').config();

createEnvSettingsFile(path.resolve(`${__dirname}/../../../dist/js/settings.js`));

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, configureDevServer({}));
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
const PORT = process.env.port || 8083;
server.listen(PORT, HOSTNAME, () => console.log(`Started server on http://${HOSTNAME}:${PORT}`));
