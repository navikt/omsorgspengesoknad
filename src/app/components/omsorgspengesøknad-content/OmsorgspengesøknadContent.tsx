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
import ArbeidStep from '../steps/arbeid/ArbeidStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import DeltBostedAvtaleStep from '../steps/delt-bosted-avtale/DeltBostedAvtaleStep';
import SummaryStep from '../steps/summary/SummaryStep';

const OmsorgspengesøknadContent: React.FunctionComponent = () => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const formik = useFormikContext<OmsorgspengesøknadFormData>();
    const history = useHistory();
    const { values, resetForm } = formik;

    const navigateToNextStep = (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    };
    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => (
                    <WelcomingPage
                        onValidSubmit={() =>
                            setTimeout(() => {
                                navigateTo(
                                    `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`,
                                    history
                                );
                            })
                        }
                    />
                )}
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

            {isAvailable(StepID.ARBEID, values) && (
                <Route
                    path={getSøknadRoute(StepID.ARBEID)}
                    render={() => (
                        <ArbeidStep onValidSubmit={() => navigateToNextStep(StepID.ARBEID)} formValues={values} />
                    )}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => (
                        <MedlemsskapStep
                            onValidSubmit={() => navigateToNextStep(StepID.MEDLEMSKAP)}
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
                    render={(props) => <SummaryStep formValues={values} onValidSubmit={() => null} />}
                />
            )}

            {(isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) || søknadHasBeenSent) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => {
                        // we clear form state here to ensure that no steps will be available
                        // after the application has been sent. this is done in a setTimeout
                        // because we do not want to update state during render.
                        setTimeout(() => {
                            resetForm();
                        });
                        setSøknadHasBeenSent(true);
                        return <ConfirmationPage />;
                    }}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default OmsorgspengesøknadContent;
