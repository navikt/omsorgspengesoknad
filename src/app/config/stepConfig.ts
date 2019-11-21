import routeConfig from './routeConfig';
import { getSøknadRoute } from '../utils/routeUtils';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'TIDSROM' = 'tidsrom',
    'MEDLEMSKAP' = 'medlemskap',
    'LEGEERKLÆRING' = 'legeerklaering',
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

export const getStepConfig = (): StepConfigInterface => {
    let idx = 0;
    const config = {
        [StepID.OPPLYSNINGER_OM_BARNET]: {
            ...getStepConfigItemTextKeys(StepID.OPPLYSNINGER_OM_BARNET),
            index: idx++,
            nextStep: StepID.TIDSROM,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE
        },
        [StepID.TIDSROM]: {
            ...getStepConfigItemTextKeys(StepID.TIDSROM),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)
        },
        [StepID.MEDLEMSKAP]: {
            ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
            index: idx++,
            nextStep: StepID.LEGEERKLÆRING,
            backLinkHref: getSøknadRoute(StepID.TIDSROM)
        },
        [StepID.LEGEERKLÆRING]: {
            ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
            index: idx++,
            nextStep: StepID.SUMMARY,
            backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP)
        },
        [StepID.SUMMARY]: {
            ...getStepConfigItemTextKeys(StepID.SUMMARY),
            index: idx++,
            backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING),
            nextButtonLabel: 'step.sendButtonLabel',
            nextButtonAriaLabel: 'step.sendButtonAriaLabel'
        }
    };
    return config;
};

export interface StepConfigProps {
    nextStepRoute: string | undefined;
}

export const stepConfig: StepConfigInterface = getStepConfig();
