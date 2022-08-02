import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import RouteConfig from '../config/routeConfig';
import { SoknadFormData } from '../types/SoknadFormData';
import { getAvailableSteps } from '../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import LegeerklæringStep from './legeerklæring/LegeerklæringStep';
import OpplysningerOmBarnetStep from './opplysninger-om-barnet/OpplysningerOmBarnetStep';
import DeltBostedAvtaleStep from './delt-bosted-avtale/DeltBostedAvtaleStep';
import OppsummeringStep from './summary/OppsummeringStep';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import { useIntl } from 'react-intl';
import { Barn } from '../types/Barn';
import { useSoknadContext } from './SoknadContext';
import { mapFormDataToApiData } from '../utils/mapFormDataToApiData';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Person } from '../types/Person';
import { StepID } from './soknadStepsConfig';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import VelkommenPage from '../pages/velkommen-page/VelkommenPage';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import { useFormikContext } from 'formik';
interface Props {
    soknadId?: string;
    barn?: Barn[];
    søker: Person;
}

const SoknadRoutes: React.FC<Props> = ({ soknadId, søker, barn = [] }) => {
    const intl = useIntl();
    const { values, resetForm } = useFormikContext<SoknadFormData>();

    const availableSteps = getAvailableSteps(values);
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();

    const renderSoknadStep = (søker: Person, barn: Barn[], stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.OPPLYSNINGER_OM_BARNET:
                return <OpplysningerOmBarnetStep barn={barn} søker={søker} formData={values} />;
            case StepID.LEGEERKLÆRING:
                return <LegeerklæringStep formData={values} />;
            case StepID.DELT_BOSTED:
                return <DeltBostedAvtaleStep formData={values} />;
            case StepID.SUMMARY:
                const apiValues = mapFormDataToApiData(values, barn, intl.locale as Locale);
                return (
                    <OppsummeringStep
                        søker={søker}
                        barn={barn}
                        søknadenGjelderEtAnnetBarn={values.søknadenGjelderEtAnnetBarn}
                        barnetSøknadenGjelder={values.barnetSøknadenGjelder}
                        apiValues={apiValues}
                    />
                );
        }
    };

    const lastAvailableStep = availableSteps.slice(-1)[0];
    const lastAvailableStepInfo: LastAvailableStepInfo | undefined = lastAvailableStep
        ? {
              route: soknadStepsConfig[lastAvailableStep].route,
              title: soknadStepUtils.getStepTexts(intl, soknadStepsConfig[lastAvailableStep]).stepTitle,
          }
        : undefined;

    return (
        <Switch>
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} exact={true}>
                <VelkommenPage />
            </Route>
            <Route path={RouteConfig.SØKNAD_SENDT_ROUTE} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={() => {
                        if (isSuccess(sendSoknadStatus.status)) {
                            return <ConfirmationPage resetForm={resetForm} />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>

            {soknadId === undefined && <Redirect key="redirectToWelcome" to={RouteConfig.SØKNAD_ROUTE_PREFIX} />}
            {soknadId &&
                availableSteps.map((step) => {
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={() => renderSoknadStep(søker, barn, step)}
                        />
                    );
                })}
            <Route path="*">
                <ErrorPage
                    contentRenderer={() => (
                        <SoknadErrorMessages.MissingSoknadDataError lastAvailableStep={lastAvailableStepInfo} />
                    )}></ErrorPage>
            </Route>
        </Switch>
    );
};

export default SoknadRoutes;
