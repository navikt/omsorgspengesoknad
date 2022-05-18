import * as React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { navigateTo } from '../../utils/navigationUtils';
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

const OmsorgspengesøknadContent: React.FC = () => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const { values, resetForm } = useFormikContext<OmsorgspengesøknadFormData>();
    const history = useHistory();
    console.log(values);
    const { logSoknadStartet } = useAmplitudeInstance();

    const navigateToNextStep = (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    };

    const startSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        setTimeout(() => {
            navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`, history);
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
                            onValidSubmit={() => navigateToNextStep(StepID.OPPLYSNINGER_OM_BARNET)}
                            formValues={values}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => (
                        <LegeerklæringStep
                            onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)}
                            formValues={values}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.DELT_BOSTED, values) && (
                <Route
                    path={getSøknadRoute(StepID.DELT_BOSTED)}
                    render={() => (
                        <DeltBostedAvtaleStep
                            onValidSubmit={() => navigateToNextStep(StepID.DELT_BOSTED)}
                            formValues={values}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={() => (
                        <SummaryStep
                            formValues={values}
                            onValidSubmit={() => null}
                            onApplicationSent={() => {
                                setSøknadHasBeenSent(true);
                                resetForm();
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
