import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { navigateTo, navigateToLoginPage } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import DeltBostedAvtaleStep from '../steps/delt-bosted-avtale/DeltBostedAvtaleStep';
import SummaryStep from '../steps/summary/SummaryStep';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { SKJEMANAVN } from '../../App';
import SøknadTempStorage from '../omsorgspengesøknad/SøknadTempStorage';
import { isForbidden, isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import appSentryLogger from '../../utils/appSentryLogger';
import { BarnReceivedFromApi, Person } from '../../types/Søkerdata';

interface Props {
    søker: Person;
    barn?: BarnReceivedFromApi[];
}

const OmsorgspengesøknadContent: React.FC<Props> = ({ søker, barn = [] }) => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const { values, resetForm } = useFormikContext<OmsorgspengesøknadFormData>();
    const history = useHistory();

    const { logSoknadStartet } = useAmplitudeInstance();

    const navigateToNextStep = async (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                SøknadTempStorage.update(values, stepId)
                    .then(() => {
                        navigateTo(nextStepRoute, history);
                    })
                    .catch((error) => {
                        if (isForbidden(error) || isUnauthorized(error)) {
                            navigateToLoginPage();
                        } else {
                            appSentryLogger.logApiError(error);
                            navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
                        }
                    });
            }
        });
    };

    const startSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        setTimeout(() => {
            SøknadTempStorage.create().then(() => {
                navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`, history);
            });
        });
    };

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => <WelcomingPage onValidSubmit={startSoknad} />}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                    render={() => (
                        <OpplysningerOmBarnetStep
                            barn={barn}
                            søker={søker}
                            formValues={values}
                            onValidSubmit={() => navigateToNextStep(StepID.OPPLYSNINGER_OM_BARNET)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => <LegeerklæringStep onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)} />}
                />
            )}

            {isAvailable(StepID.DELT_BOSTED, values) && (
                <Route
                    path={getSøknadRoute(StepID.DELT_BOSTED)}
                    render={() => <DeltBostedAvtaleStep onValidSubmit={() => navigateToNextStep(StepID.DELT_BOSTED)} />}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={() => (
                        <SummaryStep
                            registrerteBarn={barn}
                            onApplicationSent={() => {
                                setSøknadHasBeenSent(true);
                                resetForm();
                                SøknadTempStorage.purge();
                                navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
                            }}
                        />
                    )}
                />
            )}

            {(isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) || søknadHasBeenSent) && (
                <Route path={RouteConfig.SØKNAD_SENDT_ROUTE} render={() => <ConfirmationPage />} />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default OmsorgspengesøknadContent;
