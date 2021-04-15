import RouteConfig from '../config/routeConfig';
import { getStepConfig, StepID } from '../config/stepConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import {
    legeerklæringStepAvailable,
    opplysningerOmBarnetStepAvailable,
    samværsavtaleStepAvailable,
    summaryStepAvailable,
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
    switch (path) {
        case StepID.OPPLYSNINGER_OM_BARNET:
            return opplysningerOmBarnetStepAvailable(values);
        case StepID.LEGEERKLÆRING:
            return legeerklæringStepAvailable(values);
        case StepID.DELT_BOSTED:
            return samværsavtaleStepAvailable();
        case StepID.SUMMARY:
            return summaryStepAvailable(values);
        case RouteConfig.SØKNAD_SENDT_ROUTE:
            return values[AppFormField.harBekreftetOpplysninger];
    }
    return false;
};
