import routeConfig from './routeConfig';
import { getSøknadRoute } from '../utils/routeUtils';
import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import { includeAvtaleStep } from '../utils/stepUtils';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'MEDLEMSKAP' = 'medlemskap',
    'LEGEERKLÆRING' = 'legeerklaering',
    'SAMVÆRSAVTALE' = 'samværsavtale',
    'SUMMARY' = 'oppsummering'
}

export interface StepConfigItemTexts {
    pageTitle: string;
    stepTitle: string;
    stepIndicatorLabel: string;
    nextButtonLabel?: string;
    nextButtonAriaLabel?: string;
}
export interface StepItemConfigInterface extends StepConfigItemTexts {
    index: number;
    nextStep?: StepID;
    backLinkHref?: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

const getStepConfigItemTextKeys = (stepId: StepID): StepConfigItemTexts => {
    return {
        pageTitle: `step.${stepId}.pageTitle`,
        stepTitle: `step.${stepId}.stepTitle`,
        stepIndicatorLabel: `step.${stepId}.stepIndicatorLabel`,
        nextButtonLabel: 'step.nextButtonLabel',
        nextButtonAriaLabel: 'step.nextButtonAriaLabel'
    };
};

export const getStepConfig = (formData?: OmsorgspengesøknadFormData): StepConfigInterface => {
    let idx = 0;
    const avtaleStepIsIncluded = formData ? includeAvtaleStep(formData) : true;
    const config = {
        [StepID.OPPLYSNINGER_OM_BARNET]: {
            ...getStepConfigItemTextKeys(StepID.OPPLYSNINGER_OM_BARNET),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE
        },
        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.LEGEERKLÆRING,
            backLinkHref: getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)
        },
        [StepID.LEGEERKLÆRING]: {
            ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
            index: idx++,
            nextStep: avtaleStepIsIncluded ? StepID.SAMVÆRSAVTALE : StepID.SUMMARY,
            backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP)
        }
    };

    if (avtaleStepIsIncluded) {
        config[StepID.SAMVÆRSAVTALE] = {
            ...getStepConfigItemTextKeys(StepID.SAMVÆRSAVTALE),
            index: idx++,
            nextStep: StepID.SUMMARY,
            backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING)
        };
    }

    config[StepID.SUMMARY] = {
        ...getStepConfigItemTextKeys(StepID.SUMMARY),
        index: idx++,
        backLinkHref: avtaleStepIsIncluded
            ? getSøknadRoute(StepID.SAMVÆRSAVTALE)
            : getSøknadRoute(StepID.LEGEERKLÆRING),
        nextButtonLabel: 'step.sendButtonLabel',
        nextButtonAriaLabel: 'step.sendButtonAriaLabel'
    };

    return config;
};

export interface StepConfigProps {
    nextStepRoute: string | undefined;
}

export const stepConfig: StepConfigInterface = getStepConfig();
