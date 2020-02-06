import { IntlShape } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from 'app/config/stepConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import {
    arbeidStepIsValid, legeerklæringStepIsValid, medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid, welcomingPageIsValid
} from '../validation/stepValidations';

export const includeAvtaleStep = (formData: Partial<OmsorgspengesøknadFormData>): boolean =>
    formData !== undefined && formData[AppFormField.sammeAdresse] === YesOrNo.NO;

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
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

export const arbeidStepIsAvailable = (formData: OmsorgspengesøknadFormData) =>
    opplysningerOmBarnetStepIsValid(formData);

export const medlemskapStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) && arbeidStepIsValid(formData) && opplysningerOmBarnetStepIsValid(formData);

export const legeerklæringStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    arbeidStepIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    medlemskapStepIsValid(formData);

export const samværsavtaleStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    arbeidStepIsValid(formData) &&
    medlemskapStepIsValid(formData) &&
    legeerklæringStepIsValid();

export const summaryStepAvailable = (formData: OmsorgspengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    arbeidStepIsValid(formData) &&
    medlemskapStepIsValid(formData) &&
    legeerklæringStepIsValid();
