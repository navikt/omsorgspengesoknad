const path = require('path');
const process = require('process');
const express = require('express');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const compression = require('compression');
const helmet = require('helmet');
const createEnvSettingsFile = require('./src/build/scripts/envSettings');

createEnvSettingsFile(path.resolve(`${__dirname}/dist/js/settings.js`));

const server = express();
server.use(helmet());
server.use(compression());
server.set('views', `${__dirname}/dist`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/familie/sykdom-i-familien/soknad/omsorgspenger';

server.use(`${PUBLIC_PATH}/dist/js`, express.static(path.resolve(__dirname, 'dist/js')));
server.use(`${PUBLIC_PATH}/dist/css`, express.static(path.resolve(__dirname, 'dist/css')));

const routerHealth = express.Router();
server.use(`${PUBLIC_PATH}/health`, routerHealth);
routerHealth.get('/isAlive', (req, res) => res.sendStatus(200));
routerHealth.get('/isReady', (req, res) => res.sendStatus(200));

const renderApp = () =>
    new Promise((resolve, reject) => {
        server.render('index.html', (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const startServer = (html) => {
    const routeSoknad = express.Router();
    routeSoknad.use((req, res) => {
        res.send(html);
    });
    server.use('/soknad', routeSoknad);
    server.use('/barn', routeSoknad);
    server.use('/', routeSoknad);

    const port = process.env.PORT || 8080;
    server.listen(port, () => {
        console.log(`Server-test Web App listening on port: ${port}`);
    });
};

const startExpressWebServer = async () => {
    if (!process.env.PUBLIC_PATH) {
        console.error('PUBLIC_PATH env var must be defined!');
        process.exit(1);
    }
    console.log('PUBLIC_PATH', process.env.PUBLIC_PATH);
    if (!process.env.API_URL) {
        console.error('API_URL env var must be defined!');
        process.exit(1);
    }
    try {
        const html = await renderApp();
        startServer(html);
    }
    catch (e) {
        console.error(e);
    }
};

startExpressWebServer();