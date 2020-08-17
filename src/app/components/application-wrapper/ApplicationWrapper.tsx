import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import ApplicationMessages from 'common/dev-utils/intl/application-messages/ApplicationMessages';
import { Locale } from 'common/types/Locale';
import { Søkerdata } from '../../types/Søkerdata';
import { getEnvironmentVariable } from '../../utils/envUtils';
import IntlProvider, { appBokmålstekster, appNynorsktekster } from '../intl-provider/IntlProvider';

interface ApplicationWrapperProps {
    children: React.ReactNode;
    søkerdata?: Søkerdata;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}
const ApplicationWrapper = ({ locale, children }: ApplicationWrapperProps) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                <Router basename={getEnvironmentVariable('PUBLIC_PATH')}>
                    {children}
                    <ApplicationMessages
                        messages={{
                            nb: appBokmålstekster,
                            nn: appNynorsktekster
                        }}
                        title="Søknad om ekstra omsorgsdager"
                    />
                </Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
