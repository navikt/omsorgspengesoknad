import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import bostedUtlandMessages from 'common/forms/bosted-utland/bostedUtlandMessages';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
import { Locale } from 'common/types/Locale';

export const appBokmålstekster = require('../../i18n/nb.json');
export const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = { ...allCommonMessages.nb, ...bostedUtlandMessages.nb, ...appBokmålstekster };
const nynorsktekster = { ...allCommonMessages.nn, ...bostedUtlandMessages.nn, ...appNynorsktekster };

export interface IntlProviderProps {
    locale: Locale;
}

export interface IntlProviderProps {
    locale: Locale;
    children: React.ReactNode;
    onError?: (err: any) => void;
}

const IntlProvider = ({ locale, children, onError }: IntlProviderProps) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
