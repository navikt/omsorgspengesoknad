const express = require('express');
const Busboy = require('busboy');
const path = require('path');

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = [
        'http://host.docker.internal:8083',
        'https://omsorgspengesoknad-mock.nais.oera.no',
        'http://localhost:8083',
        'http://web:8083'
    ];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }

    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE']);
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

const søkerMock = {
    fornavn: 'Test',
    mellomnavn: undefined,
    etternavn: 'Testesen',
    fødselsnummer: '12345123456',
    myndig: true
};

const barnMock = {
    barn: [
        {
            fødselsdato: '1990-01-01',
            fornavn: 'Barn',
            mellomnavn: 'Barne',
            etternavn: 'Barnesen',
            aktørId: '1'
        },
        {
            fødselsdato: '1990-01-02',
            fornavn: 'Mock',
            etternavn: 'Mocknes',
            aktørId: '2'
        }
    ]
};

const isLoggedIn = (req) => req.headers.cookie !== undefined;

const startExpressServer = () => {
    const port = process.env.PORT || 8088;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/auth-mock', (req, res) => {
        let authMockHtmlFilePath = path.resolve(__dirname, 'auth-mock-index.html');
        res.sendFile(authMockHtmlFilePath);
    });
    server.get('/auth-mock/cookie', (req, res) => {
        res.cookie('omsLocalLoginCookie', 'mysecrettoken').sendStatus(201);
    });

    server.get('/soker', (req, res) => {
        if (isLoggedIn(req)) {
            res.send(søkerMock);
        } else {
            res.status(401).send();
        }
    });

    server.post('/vedlegg', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Location');
        res.set('Location', 'nav.no');
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('finish', () => {
            res.writeHead(200, { Location: '/vedlegg' });
            res.end();
        });
        req.pipe(busboy);
    });

    server.get('/barn', (req, res) => res.send(barnMock));

    server.post('/soknad', (req, res) => {
        res.sendStatus(200);
    });

    server.listen(port, () => {
        console.log(`Express mock-api server listening on port: ${port}`);
    });
};

startExpressServer();
