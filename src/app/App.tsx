import * as React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude';
import Modal from 'nav-frontend-modal';
import IntroPage from './pages/intro-page/IntroPage';
import RouteConfig from './config/routeConfig';
import { getEnvironmentVariable } from './utils/envUtils';
import '@navikt/sif-common-core/lib/styles/globalStyles.less';
import SoknadApplication from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplication';
import SoknadApplicationCommonRoutes from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplicationCommonRoutes';
import SoknadRemoteDataFetcher from './soknad/SoknadRemoteDataFetcher';
import { applicationIntlMessages } from './i18n/applicationMessages';

export const APPLICATION_KEY = 'omsorgspengersoknad';
export const SKJEMANAVN = 'Søknad om omsorgspenger - utvidet rett';

const App: React.FC = () => {
    const publicPath = getEnvironmentVariable('PUBLIC_PATH');

    return (
        <AmplitudeProvider applicationKey={APPLICATION_KEY}>
            <SoknadApplication
                appName={SKJEMANAVN}
                intlMessages={applicationIntlMessages}
                sentryKey={APPLICATION_KEY}
                appStatus={{
                    applicationKey: APPLICATION_KEY,
                    sanityConfig: {
                        projectId: getEnvironmentVariable('APPSTATUS_PROJECT_ID'),
                        dataset: getEnvironmentVariable('APPSTATUS_DATASET'),
                    },
                }}
                publicPath={publicPath}>
                <SoknadApplicationCommonRoutes
                    contentRoutes={[
                        <Route path="/" key="intro" exact={true} component={IntroPage} />,
                        <Route
                            path={RouteConfig.SØKNAD_ROUTE_PREFIX}
                            key="soknad"
                            component={SoknadRemoteDataFetcher}
                        />,
                    ]}
                />
            </SoknadApplication>
        </AmplitudeProvider>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
