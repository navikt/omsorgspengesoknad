import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import bostedUtlandMessages from 'common/forms/bosted-utland/bostedUtlandMessages';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
// import MessagesPreview from 'common/dev-utils/intl/messages-preview/MessagesPreview';
import { Locale } from 'common/types/Locale';

const appBokmålstekster = require('../../i18n/nb.json');
const appNynorsktekster = require('../../i18n/nn.json');

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
            {/* <MessagesPreview
                title="Søknad ekstra omsorgsdager"
                showMissingTextSummary={false}
                messages={{
                    nb: bokmålstekster,
                    nn: nynorsktekster
                }}
            /> */}
        </Provider>
    );
};

export default IntlProvider;
