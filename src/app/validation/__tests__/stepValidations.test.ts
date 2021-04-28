import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { AppFormField, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { welcomingPageIsValid } from '../stepValidations';

const formData: Partial<OmsorgspengesøknadFormData> = {};

describe('stepValidation tests', () => {
    describe('welcomingPageIsValid', () => {
        it(`should be valid if ${AppFormField.harForståttRettigheterOgPlikter} is true and ${AppFormField.kroniskEllerFunksjonshemming} is YES`, () => {
            formData[AppFormField.harForståttRettigheterOgPlikter] = true;
            formData[AppFormField.kroniskEllerFunksjonshemming] = YesOrNo.YES;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(true);
        });
        it(`should be invalid if ${AppFormField.harForståttRettigheterOgPlikter} is undefined or false`, () => {
            formData[AppFormField.harForståttRettigheterOgPlikter] = undefined;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
            formData[AppFormField.harForståttRettigheterOgPlikter] = false;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
        });
        it(`should be invalid if ${AppFormField.kroniskEllerFunksjonshemming} is undefined`, () => {
            formData[AppFormField.kroniskEllerFunksjonshemming] = YesOrNo.NO;
            expect(welcomingPageIsValid(formData as OmsorgspengesøknadFormData)).toBe(false);
        });
    });
});
