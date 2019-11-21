import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import {
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid
} from '../validation/stepValidations';
import { StepConfigItemTexts, StepID, StepConfigInterface } from 'app/config/stepConfig';
import { InjectedIntl } from 'react-intl';
import intlHelper from '../../common/utils/intlUtils';

export const getStepTexts = (
    intl: InjectedIntl,
    stepId: StepID,
    stepConfig: StepConfigInterface
): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
        nextButtonAriaLabel: conf.nextButtonAriaLabel ? intlHelper(intl, conf.nextButtonAriaLabel) : undefined
    };
};

export const opplysningerOmBarnetStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData);

export const opplysningerOmTidsromStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) && opplysningerOmBarnetStepIsValid(formData);

export const medlemskapStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData);

export const legeerklæringStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    medlemskapStepIsValid(formData);

export const summaryStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    medlemskapStepIsValid(formData) &&
    legeerklæringStepIsValid();
