import * as React from 'react';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import { Route, Switch } from 'react-router-dom';
import RouteConfig from './config/routeConfig';
import Omsorgspengesøknad from './components/omsorgspengesøknad/Omsorgspengesøknad';
import { render } from 'react-dom';
import Modal from 'nav-frontend-modal';
import { Locale } from '../common/types/Locale';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from './utils/localeUtils';
import { isFeatureEnabled, Feature } from './utils/featureToggleUtils';
import UnavailablePage from './components/pages/unavailable-page/UnavailablePage';
import IntroHarRettPage from './components/pages/intro-har-rett-page/IntroHarRettPage';
import IntroSkjemaPage from './components/pages/intro-skjema-page/IntroSkjemaPage';
import '../common/styles/globalStyles.less';

const localeFromSessionStorage = getLocaleFromSessionStorage();

const App: React.FunctionComponent = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    return (
        <ApplicationWrapper
            locale={locale}
            onChangeLocale={(activeLocale: Locale) => {
                setLocaleInSessionStorage(activeLocale);
                setLocale(activeLocale);
            }}>
            <>
                {isFeatureEnabled(Feature.UTILGJENGELIG) ? (
                    <UnavailablePage />
                ) : (
                    <Switch>
                        <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} component={Omsorgspengesøknad} />
                        <Route path="/skjema" component={IntroSkjemaPage} />
                        <Route path="/" component={IntroHarRettPage} />
                    </Switch>
                )}
            </>
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
