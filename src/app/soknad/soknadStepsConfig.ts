import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { SoknadFormData } from '../types/SoknadFormData';
import { includeAvtaleStep } from '../utils/stepUtils';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'LEGEERKLÆRING' = 'legeerklaering',
    'DELT_BOSTED' = 'deltBosted',
    'SUMMARY' = 'oppsummering',
}

const getSoknadSteps = (values: SoknadFormData): StepID[] => {
    const avtaleStepIsIncluded = values ? includeAvtaleStep(values) : true;
    return [
        StepID.OPPLYSNINGER_OM_BARNET,
        StepID.LEGEERKLÆRING,
        ...(avtaleStepIsIncluded ? [StepID.DELT_BOSTED] : []),
        StepID.SUMMARY,
    ];
};

export const getSoknadStepsConfig = (values: SoknadFormData): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values), SoknadApplicationType.SOKNAD);
