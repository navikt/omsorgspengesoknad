import {
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import { includeAvtaleStep } from '../utils/stepUtils';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: OmsorgspengesøknadFormData) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    søkersRelasjonTilBarnet,
    barnetSøknadenGjelder,
}: OmsorgspengesøknadFormData) => {
    const formIsValid =
        getStringValidator({ required: false, maxLength: 50 })(barnetsNavn) === undefined &&
        getFødselsnummerValidator()(barnetsFødselsnummer) === undefined &&
        getRequiredFieldValidator()(søkersRelasjonTilBarnet) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return getRequiredFieldValidator()(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const legeerklæringStepIsValid = () => true;

export const samværsavtaleStepIsValid = (values: OmsorgspengesøknadFormData): boolean => {
    if (includeAvtaleStep(values)) {
        return values.samværsavtale !== undefined && values.samværsavtale.length > 0;
    }
    return true;
};
