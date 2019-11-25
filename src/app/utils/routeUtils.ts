import { StepID, getStepConfig } from '../config/stepConfig';
import RouteConfig from '../config/routeConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import { appIsRunningInDevEnvironment, appIsRunningInDemoMode } from './envUtils';
import {
    legeerklæringStepAvailable,
    medlemskapStepAvailable,
    opplysningerOmBarnetStepAvailable,
    summaryStepAvailable,
    samværsavtaleStepAvailable,
    arbeidStepIsAvailable
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: OmsorgspengesøknadFormData): string | undefined => {
    const stepConfig = getStepConfig(formData);
    return stepConfig[stepId] ? getSøknadRoute(stepConfig[stepId].nextStep) : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: OmsorgspengesøknadFormData) => {
    if (!appIsRunningInDevEnvironment() && !appIsRunningInDemoMode()) {
        switch (path) {
            case StepID.OPPLYSNINGER_OM_BARNET:
                return opplysningerOmBarnetStepAvailable(values);
            case StepID.LEGEERKLÆRING:
                return legeerklæringStepAvailable(values);
            case StepID.ARBEID:
                return arbeidStepIsAvailable(values);
            case StepID.MEDLEMSKAP:
                return medlemskapStepAvailable(values);
            case StepID.SAMVÆRSAVTALE:
                return samværsavtaleStepAvailable(values);
            case StepID.SUMMARY:
                return summaryStepAvailable(values);
            case RouteConfig.SØKNAD_SENDT_ROUTE:
                return values[AppFormField.harBekreftetOpplysninger];
        }
    }
    return true;
};
