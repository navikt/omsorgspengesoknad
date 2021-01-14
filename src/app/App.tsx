import * as React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import Modal from 'nav-frontend-modal';
import { Locale } from 'common/types/Locale';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import Omsorgspengesøknad from './components/omsorgspengesøknad/Omsorgspengesøknad';
import IntroPage from './components/pages/intro-page/IntroPage';
import UnavailablePage from './components/pages/unavailable-page/UnavailablePage';
import RouteConfig from './config/routeConfig';
import appSentryLogger from './utils/appSentryLogger';
import { getEnvironmentVariable } from './utils/envUtils';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from './utils/localeUtils';
import 'common/styles/globalStyles.less';

appSentryLogger.init();

const localeFromSessionStorage = getLocaleFromSessionStorage();

const getAppStatusSanityConfig = ():
    | {
          projectId: string;
          dataset: string;
      }
    | undefined => {
    const projectId = getEnvironmentVariable('APPSTATUS_PROJECT_ID');
    const dataset = getEnvironmentVariable('APPSTATUS_DATASET');
    return !projectId || !dataset ? undefined : { projectId, dataset };
};

const APPLICATION_KEY = 'omsorgspengersoknad';

const App = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    const appStatusSanityConfig = getAppStatusSanityConfig();
    const renderContent = (): React.ReactNode => (
        <Switch>
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} component={Omsorgspengesøknad} />
            <Route path="/" component={IntroPage} />
        </Switch>
    );
    return (
        <ApplicationWrapper
            locale={locale}
            onChangeLocale={(activeLocale: Locale) => {
                setLocaleInSessionStorage(activeLocale);
                setLocale(activeLocale);
            }}>
            {appStatusSanityConfig ? (
                <AppStatusWrapper
                    applicationKey={APPLICATION_KEY}
                    sanityConfig={appStatusSanityConfig}
                    contentRenderer={renderContent}
                    unavailableContentRenderer={(): React.ReactNode => <UnavailablePage />}
                />
            ) : (
                renderContent()
            )}
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
