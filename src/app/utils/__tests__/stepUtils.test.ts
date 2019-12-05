import * as stepValidations from '../../validation/stepValidations';
import * as stepUtils from '../stepUtils';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { YesOrNo } from '../../../common/types/YesOrNo';

jest.mock('./../../validation/stepValidations', () => {
    return {
        welcomingPageIsValid: jest.fn(() => true),
        opplysningerOmBarnetStepIsValid: jest.fn(() => true),
        medlemskapStepIsValid: jest.fn(() => true),
        legeerklæringStepIsValid: jest.fn(() => true)
    };
});

const formData: Partial<OmsorgspengesøknadFormData> = {};

describe('stepUtils', () => {
    it('should include avtalestep if deltOmsorg is YES', () => {
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: YesOrNo.NO })).toBeTruthy();
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: undefined })).toBeFalsy();
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: YesOrNo.YES })).toBeFalsy();
        expect(stepUtils.includeAvtaleStep({ sammeAdresse: YesOrNo.DO_NOT_KNOW })).toBeFalsy();
    });

    describe('opplysningerOmBarnetStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.opplysningerOmBarnetStepAvailable(formData as OmsorgspengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(stepValidations.welcomingPageIsValid({} as any));
        });
    });

    describe('medlemskapStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.medlemskapStepAvailable(formData as OmsorgspengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any)
            );
        });
    });

    describe('legeerklæringStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.legeerklæringStepAvailable(formData as OmsorgspengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.medlemskapStepIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.medlemskapStepIsValid({} as any)
            );
        });
    });

    describe('summaryStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.summaryStepAvailable(formData as OmsorgspengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.medlemskapStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.legeerklæringStepIsValid).toHaveBeenCalled();
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.medlemskapStepIsValid({} as any) &&
                    stepValidations.legeerklæringStepIsValid()
            );
        });
    });
});
