/* eslint-disable @typescript-eslint/no-non-null-assertion */
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { BarnToSendToApi, OmsorgspengesøknadApiData } from '../types/OmsorgspengesøknadApiData';
import { OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi } from '../types/Søkerdata';

export const mapBarnToApiData = (
    barn: BarnReceivedFromApi[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetsFødselsdato: string | undefined,
    barnetSøknadenGjelder: string | undefined
): BarnToSendToApi => {
    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktørId === barnetSøknadenGjelder)!;
        const { fornavn, etternavn, mellomnavn, aktørId } = barnChosenFromList;
        return {
            navn: formatName(fornavn, etternavn, mellomnavn),
            norskIdentifikator: null,
            aktørId,
            fødselsdato: formatDateToApiFormat(barnChosenFromList.fødselsdato),
        };
    } else {
        const barnFDato = datepickerUtils.getDateFromDateString(barnetsFødselsdato);
        return {
            navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
            norskIdentifikator: barnetsFødselsnummer || null,
            aktørId: null,
            fødselsdato: barnFDato !== undefined ? formatDateToApiFormat(barnFDato) : null,
        };
    }
};

export const mapFormDataToApiData = (
    {
        kroniskEllerFunksjonshemming,
        sammeAdresse,
        erYrkesaktiv,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsFødselsdato,
        barnetSøknadenGjelder,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        søkersRelasjonTilBarnet,
        legeerklæring,
        samværsavtale,
    }: OmsorgspengesøknadFormData,
    barn: BarnReceivedFromApi[],
    sprak: Locale
): OmsorgspengesøknadApiData => {
    const barnObject: BarnToSendToApi = mapBarnToApiData(
        barn,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsFødselsdato,
        barnetSøknadenGjelder
    );

    const apiData: OmsorgspengesøknadApiData = {
        newVersion: true,
        språk: (sprak as any) === 'en' ? 'nn' : sprak,
        kroniskEllerFunksjonshemming: kroniskEllerFunksjonshemming === YesOrNo.YES,
        erYrkesaktiv: erYrkesaktiv === YesOrNo.YES,
        barn: barnObject,
        relasjonTilBarnet: barnObject.aktørId ? undefined : søkersRelasjonTilBarnet,
        sammeAdresse: sammeAdresse === YesOrNo.YES,
        legeerklæring: legeerklæring
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            .map(({ url }) => url!),
        samværsavtale:
            samværsavtale && samværsavtale.length > 0
                ? samværsavtale.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!)
                : undefined,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
    };

    return apiData;
};
