import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import { getSøknadRoute } from '../utils/routeUtils';
import { includeAvtaleStep } from '../utils/stepUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'MEDLEMSKAP' = 'medlemskap',
    'LEGEERKLÆRING' = 'legeerklaering',
    'DELT_BOSTED' = 'deltBosted',
    'SUMMARY' = 'oppsummering',
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
        nextButtonAriaLabel: 'step.nextButtonAriaLabel',
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
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.LEGEERKLÆRING,
            backLinkHref: getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET),
        },
        [StepID.LEGEERKLÆRING]: {
            ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
            index: idx++,
            nextStep: avtaleStepIsIncluded ? StepID.DELT_BOSTED : StepID.SUMMARY,
            backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP),
        },
    };

    if (avtaleStepIsIncluded) {
        config[StepID.DELT_BOSTED] = {
            ...getStepConfigItemTextKeys(StepID.DELT_BOSTED),
            index: idx++,
            nextStep: StepID.SUMMARY,
            backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING),
        };
    }

    config[StepID.SUMMARY] = {
        ...getStepConfigItemTextKeys(StepID.SUMMARY),
        index: idx++,
        backLinkHref: avtaleStepIsIncluded ? getSøknadRoute(StepID.DELT_BOSTED) : getSøknadRoute(StepID.LEGEERKLÆRING),
        nextButtonLabel: 'step.sendButtonLabel',
        nextButtonAriaLabel: 'step.sendButtonAriaLabel',
    };

    return config;
};

export interface StepConfigProps {
    onValidSubmit: () => void;
    formValues: OmsorgspengesøknadFormData;
}

export const stepConfig: StepConfigInterface = getStepConfig();
