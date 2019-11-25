import { OmsorgspengesøknadFormData, AppFormField } from '../types/OmsorgspengesøknadFormData';
import {
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid,
    welcomingPageIsValid,
    arbeidStepIsValid
} from '../validation/stepValidations';
import { StepConfigItemTexts, StepID, StepConfigInterface } from 'app/config/stepConfig';
import { InjectedIntl } from 'react-intl';
import intlHelper from '../../common/utils/intlUtils';
import { YesOrNo } from '../../common/types/YesOrNo';

export const includeAvtaleStep = (formData: Partial<OmsorgspengesøknadFormData>): boolean =>
    formData !== undefined && formData[AppFormField.delerOmsorg] === YesOrNo.YES;

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
