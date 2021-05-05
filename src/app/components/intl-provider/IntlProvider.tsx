import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/locale-data/nb';
import '@formatjs/intl-pluralrules/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export const appBokmålstekster = require('../../i18n/nb.json');
export const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = { ...allCommonMessages.nb, ...appBokmålstekster };
const nynorsktekster = { ...allCommonMessages.nn, ...appNynorsktekster };

export interface IntlProviderProps {
    locale: Locale;
}

export interface IntlProviderProps {
    locale: Locale;
    onError?: (err: any) => void;
}

const IntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, children, onError }) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
