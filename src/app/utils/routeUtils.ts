import { SoknadFormData } from '../types/SoknadFormData';
import { samværsavtaleStepAvailable, summaryStepAvailable } from './stepUtils';
import { StepID } from '../soknad/soknadStepsConfig';
import {
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
} from '@navikt/sif-common-formik/lib/validation';

const welcomingPageIsComplete = (harForståttRettigheterOgPlikter: boolean) => {
    return harForståttRettigheterOgPlikter === true;
};

const opplysningerOmBarnetStepIsComplete = (values: SoknadFormData) => {
    const {
        barnetsNavn,
        barnetsFødselsnummer,
        søkersRelasjonTilBarnet,
        barnetSøknadenGjelder,
        harForståttRettigheterOgPlikter,
    } = values;
    const formIsValid =
        welcomingPageIsComplete(harForståttRettigheterOgPlikter) &&
        getStringValidator({ required: true, maxLength: 50 })(barnetsNavn) === undefined &&
        getFødselsnummerValidator({ required: true })(barnetsFødselsnummer) === undefined &&
        getRequiredFieldValidator()(søkersRelasjonTilBarnet) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return getRequiredFieldValidator()(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

const legeerklæringStepIsComplete = (values: SoknadFormData) => opplysningerOmBarnetStepIsComplete(values);

export const getAvailableSteps = (values: SoknadFormData): StepID[] => {
    const steps: StepID[] = [];

    if (welcomingPageIsComplete(values.harForståttRettigheterOgPlikter)) {
        steps.push(StepID.OPPLYSNINGER_OM_BARNET);
    }

    if (opplysningerOmBarnetStepIsComplete(values)) {
        steps.push(StepID.LEGEERKLÆRING);
    }

    if (legeerklæringStepIsComplete(values) && samværsavtaleStepAvailable(values)) {
        steps.push(StepID.DELT_BOSTED);
    }

    if (summaryStepAvailable(values)) {
        steps.push(StepID.SUMMARY);
    }

    return steps;
};
