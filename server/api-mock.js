const express = require('express');
const busboyCons = require('busboy');
const os = require('os');
const fs = require('fs');

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080'];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }

    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'DELETE']);
    res.set('Access-Control-Allow-Credentials', true);
    next();
});
const MELLOMLAGRING_JSON = `${os.tmpdir()}/omsorgspengesoknad-mellomlagring.json`;

const isJSON = (str) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};

const writeFileAsync = async (path, text) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const readFileSync = (path) => {
    return fs.readFileSync(path, 'utf8');
};

const existsSync = (path) => fs.existsSync(path);

const søkerMock = {
    fornavn: 'Test',
    mellomnavn: undefined,
    etternavn: 'Testesen',
    fødselsnummer: '12345123456',
};

const barnMock = {
    barn: [
        {
            fødselsdato: '1990-01-01',
            fornavn: 'Barn',
            mellomnavn: 'Barne',
            etternavn: 'Barnesen',
            aktørId: '1',
        },
        {
            fødselsdato: '1990-01-02',
            fornavn: 'Mock',
            etternavn: 'Mocknes',
            aktørId: '2',
        },
    ],
};

const startExpressServer = () => {
    const port = process.env.PORT || 8088;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/oppslag/soker', (req, res) => {
        setTimeout(() => {
            res.send(søkerMock);
        }, 200);
    });

    server.get('/oppslag/soker-umyndig', (req, res) => {
        res.send(451);
    });

    server.post('/vedlegg', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Location');
        res.set('Location', 'nav.no');
        const busboy = busboyCons({ headers: req.headers });
        busboy.on('finish', () => {
            res.writeHead(200, { Location: '/vedlegg' });
            res.end();
        });
        req.pipe(busboy);
    });

    server.get('/oppslag/barn', (req, res) => res.send(barnMock));

    server.post('/omsorgspenger-utvidet-rett/innsending', (req, res) => {
        const body = req.body;
        console.log('[POST] body', body);
        setTimeout(() => {
            res.sendStatus(200);
        }, 2500);
    });

    server.get('/mellomlagring/OMSORGSPENGER_UTVIDET_RETT', (req, res) => {
        if (existsSync(MELLOMLAGRING_JSON)) {
            const body = readFileSync(MELLOMLAGRING_JSON);

            res.send(JSON.parse(body));
        } else {
            res.send({});
        }
    });

    server.put('/mellomlagring/OMSORGSPENGER_UTVIDET_RETT', (req, res) => {
        const body = req.body;

        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });

    server.post('/mellomlagring/OMSORGSPENGER_UTVIDET_RETT', (req, res) => {
        const body = req.body;

        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });

    server.delete('/mellomlagring/OMSORGSPENGER_UTVIDET_RETT', (req, res) => {
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
        res.sendStatus(200);
    });

    server.listen(port, () => {
        console.log(`Express mock-api server listening on port: ${port}`);
    });
};

startExpressServer();
