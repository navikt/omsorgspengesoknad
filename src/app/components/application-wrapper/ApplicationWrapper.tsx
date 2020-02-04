import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import IntlProvider from '../intl-provider/IntlProvider';
import { Søkerdata } from '../../types/Søkerdata';
import { Locale } from 'common/types/Locale';
import { Normaltekst } from 'nav-frontend-typografi';
import DemoModeInfo from '../demo-mode-info/DemoModeInfo';
import { appIsRunningInDemoMode, getEnvironmentVariable } from '../../utils/envUtils';
import LanguageToggle from 'common/components/language-toggle/LanguageToggle';

interface ApplicationWrapperProps {
    søkerdata?: Søkerdata;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}

const demoMode = appIsRunningInDemoMode();
const showLanguageToggle = true;

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({ locale, onChangeLocale, children }) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                {demoMode && <DemoModeInfo />}

                {/* I Påvente av oversettelser */}
                {demoMode === false && showLanguageToggle === true && (
                    <LanguageToggle locale={locale} toggle={onChangeLocale} />
                )}
                <Router basename={getEnvironmentVariable('PUBLIC_PATH')}>{children}</Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
