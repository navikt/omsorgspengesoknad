import {
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { SoknadFormData } from '../types/SoknadFormData';
import { includeAvtaleStep } from '../utils/stepUtils';

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    søkersRelasjonTilBarnet,
    barnetSøknadenGjelder,
}: SoknadFormData) => {
    const formIsValid =
        getStringValidator({ required: true, maxLength: 50 })(barnetsNavn) === undefined &&
        getFødselsnummerValidator({ required: true })(barnetsFødselsnummer) === undefined &&
        getRequiredFieldValidator()(søkersRelasjonTilBarnet) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return getRequiredFieldValidator()(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const legeerklæringStepIsValid = () => true;

export const samværsavtaleStepIsValid = (values: SoknadFormData): boolean => {
    if (includeAvtaleStep(values)) {
        return values.samværsavtale !== undefined && values.samværsavtale.length > 0;
    }
    return true;
};
