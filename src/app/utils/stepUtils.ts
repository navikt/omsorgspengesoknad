import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadFormField, SoknadFormData, SøkersRelasjonTilBarnet } from '../types/SoknadFormData';
import { legeerklæringStepIsValid, samværsavtaleStepIsValid } from '../validation/stepValidations';

export const includeAvtaleStep = (formData: Partial<SoknadFormData>): boolean =>
    formData !== undefined &&
    formData[SoknadFormField.sammeAdresse] === YesOrNo.NO &&
    formData[SoknadFormField.søkersRelasjonTilBarnet] !== SøkersRelasjonTilBarnet.FOSTERFORELDER;

export const samværsavtaleStepAvailable = (values: SoknadFormData) =>
    includeAvtaleStep(values) && legeerklæringStepIsValid();

export const summaryStepAvailable = (values: SoknadFormData) =>
    includeAvtaleStep(values) ? samværsavtaleStepIsValid(values) : legeerklæringStepIsValid();
