import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import {
    BarnToSendToApi,
    OmsorgspengesøknadApiData,
    UtenlandsoppholdApiData
} from '../types/OmsorgspengesøknadApiData';
import { attachmentUploadHasFailed } from '../../common/utils/attachmentUtils';
import { YesOrNo } from '../../common/types/YesOrNo';
import { formatName } from '../../common/utils/personUtils';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import { Locale } from 'common/types/Locale';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { getCountryName } from 'common/components/country-select/CountrySelect';
import { formatDateToApiFormat } from 'common/utils/dateUtils';

export const mapFormDataToApiData = (
    {
        kroniskEllerFunksjonshemming,
        sammeAdresse,
        erYrkesaktiv,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsForeløpigeFødselsnummerEllerDNummer,
        barnetSøknadenGjelder,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        søkersRelasjonTilBarnet,
        legeerklæring,
        samværsavtale,
        harBoddUtenforNorgeSiste12Mnd,
        arbeidssituasjon,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
        utenlandsoppholdSiste12Mnd
    }: OmsorgspengesøknadFormData,
    barn: BarnReceivedFromApi[],
    sprak: Locale
): OmsorgspengesøknadApiData => {
    const barnObject: BarnToSendToApi = { navn: null, norskIdentifikator: null, alternativId: null, aktørId: null };

    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktørId === barnetSøknadenGjelder);
        const { fornavn, etternavn, mellomnavn, aktørId } = barnChosenFromList!;
        barnObject.aktørId = aktørId;
        barnObject.navn = formatName(fornavn, etternavn, mellomnavn);
    } else {
        barnObject.navn = barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null;
        if (barnetsFødselsnummer) {
            barnObject.norskIdentifikator = barnetsFødselsnummer;
        } else if (barnetsForeløpigeFødselsnummerEllerDNummer) {
            barnObject.alternativId = barnetsForeløpigeFødselsnummerEllerDNummer;
        }
    }

    const apiData: OmsorgspengesøknadApiData = {
        newVersion: true,
        språk: (sprak as any) === 'en' ? 'nn' : sprak,
        kroniskEllerFunksjonshemming: kroniskEllerFunksjonshemming === YesOrNo.YES,
        erYrkesaktiv: erYrkesaktiv === YesOrNo.YES,
        barn: barnObject,
        relasjonTilBarnet: barnObject.aktørId ? undefined : søkersRelasjonTilBarnet,
        sammeAdresse: sammeAdresse === YesOrNo.YES,
        arbeidssituasjon,
        medlemskap: {
            harBoddIUtlandetSiste12Mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
            skalBoIUtlandetNeste12Mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
            utenlandsoppholdSiste12Mnd:
                harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdSiste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
                    : [],
            utenlandsoppholdNeste12Mnd:
                skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdNeste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
                    : []
        },
        legeerklæring: legeerklæring
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            .map(({ url }) => url!),
        samvarsavtale: samværsavtale
            ? samværsavtale.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!)
            : undefined,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter
    };

    return apiData;
};

const mapUtenlandsoppholdTilApiData = (opphold: Utenlandsopphold, locale: string): UtenlandsoppholdApiData => ({
    landnavn: getCountryName(opphold.countryCode, locale),
    landkode: opphold.countryCode,
    fraOgMed: formatDateToApiFormat(opphold.fromDate),
    tilOgMed: formatDateToApiFormat(opphold.toDate)
});
