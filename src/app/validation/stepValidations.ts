import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import * as fieldValidations from './fieldValidations';
import { YesOrNo } from '../types/YesOrNo';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: OmsorgspengesøknadFormData) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetHarIkkeFåttFødselsnummerEnda,
    søkersRelasjonTilBarnet,
    barnetSøknadenGjelder
}: OmsorgspengesøknadFormData) => {
    if (barnetHarIkkeFåttFødselsnummerEnda) {
        return fieldValidations.validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined;
    }

    const formIsValid =
        fieldValidations.validateNavn(barnetsNavn) === undefined &&
        fieldValidations.validateFødselsnummer(barnetsFødselsnummer) === undefined &&
        fieldValidations.validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return fieldValidations.validateValgtBarn(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: OmsorgspengesøknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: OmsorgspengesøknadFormData) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = () => true;
