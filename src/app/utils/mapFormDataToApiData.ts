import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import { BarnToSendToApi, OmsorgspengesøknadApiData } from '../types/OmsorgspengesøknadApiData';
import { attachmentUploadHasFailed } from '../../common/utils/attachmentUtils';
import { YesOrNo } from '../../common/types/YesOrNo';
import { formatName } from '../../common/utils/personUtils';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import { Locale } from 'common/types/Locale';

export const mapFormDataToApiData = (
    {
        kroniskEllerFunksjonshemming,
        delerOmsorg,
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
        skalBoUtenforNorgeNeste12Mnd
    }: OmsorgspengesøknadFormData,
    barn: BarnReceivedFromApi[],
    sprak: Locale
): OmsorgspengesøknadApiData => {
    const barnObject: BarnToSendToApi = { navn: null, fodselsnummer: null, alternativ_id: null, aktoer_id: null };

    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktoer_id === barnetSøknadenGjelder);
        const { fornavn, etternavn, mellomnavn, aktoer_id } = barnChosenFromList!;
        barnObject.aktoer_id = aktoer_id;
        barnObject.navn = formatName(fornavn, etternavn, mellomnavn);
    } else {
        barnObject.navn = barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null;
        if (barnetsFødselsnummer) {
            barnObject.fodselsnummer = barnetsFødselsnummer;
        } else if (barnetsForeløpigeFødselsnummerEllerDNummer) {
            barnObject.alternativ_id = barnetsForeløpigeFødselsnummerEllerDNummer;
        }
    }

    const apiData: OmsorgspengesøknadApiData = {
        new_version: true,
        sprak,
        kronisk_eller_funksjonshemming: kroniskEllerFunksjonshemming === YesOrNo.YES,
        er_yrkesaktiv: erYrkesaktiv === YesOrNo.YES,
        barn: barnObject,
        relasjon_til_barnet: barnObject.aktoer_id ? undefined : søkersRelasjonTilBarnet,
        deler_omsorg: delerOmsorg === YesOrNo.YES,
        samme_adresse: sammeAdresse === YesOrNo.YES,
        medlemskap: {
            har_bodd_i_utlandet_siste_12_mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
            skal_bo_i_utlandet_neste_12_mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
        },
        legeerklaring: legeerklæring
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            .map(({ url }) => url!),
        samvarsavtale: samværsavtale
            ? samværsavtale.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!)
            : undefined,
        har_bekreftet_opplysninger: harBekreftetOpplysninger,
        har_forstatt_rettigheter_og_plikter: harForståttRettigheterOgPlikter
    };

    return apiData;
};
