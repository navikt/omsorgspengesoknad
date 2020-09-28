import getSentryLoggerForApp from '@navikt/sif-common-sentry/lib';

const appSentryLogger = getSentryLoggerForApp('omsorgspengersoknad', ['sykdom-i-familien']);

export default appSentryLogger;
