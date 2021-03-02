import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import * as fieldValidations from './fieldValidations';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: OmsorgspengesøknadFormData) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    søkersRelasjonTilBarnet,
    barnetSøknadenGjelder,
}: OmsorgspengesøknadFormData) => {
    const formIsValid =
        fieldValidations.validateNavn(barnetsNavn) === undefined &&
        fieldValidations.validateFødselsnummer(barnetsFødselsnummer) === undefined &&
        fieldValidations.validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return fieldValidations.validateValgtBarn(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const legeerklæringStepIsValid = () => true;
