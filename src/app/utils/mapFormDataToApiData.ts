/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { Barn } from '../types/Barn';
import { BarnToSendToApi, SoknadApiData } from '../types/SoknadApiData';
import { SoknadFormData, SøkersRelasjonTilBarnet } from '../types/SoknadFormData';
import { getAttachmentURLBackend } from './attachmentUtilsAuthToken';

export const mapBarnToApiData = (
    barn: Barn[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetSøknadenGjelder: string | undefined
): BarnToSendToApi => {
    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktørId === barnetSøknadenGjelder)!;
        const { fornavn, etternavn, mellomnavn, aktørId } = barnChosenFromList;
        return {
            navn: formatName(fornavn, etternavn, mellomnavn),
            norskIdentifikator: null,
            aktørId,
        };
    } else {
        return {
            navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
            norskIdentifikator: barnetsFødselsnummer || null,
            aktørId: null,
        };
    }
};

export const mapFormDataToApiData = (
    {
        kroniskEllerFunksjonshemming,
        sammeAdresse,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetSøknadenGjelder,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        søkersRelasjonTilBarnet,
        legeerklæring,
        samværsavtale,
    }: SoknadFormData,
    barn: Barn[],
    sprak: Locale
): SoknadApiData => {
    const barnObject: BarnToSendToApi = mapBarnToApiData(
        barn,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetSøknadenGjelder
    );

    const apiData: SoknadApiData = {
        språk: (sprak as any) === 'en' ? 'nn' : sprak,
        kroniskEllerFunksjonshemming: kroniskEllerFunksjonshemming === YesOrNo.YES,
        barn: barnObject,
        relasjonTilBarnet: barnObject.aktørId ? undefined : søkersRelasjonTilBarnet,
        sammeAdresse: sammeAdresse === YesOrNo.YES,
        legeerklæring: legeerklæring
            .filter((attachment) => !attachmentUploadHasFailed(attachment))
            .map(({ url }) => getAttachmentURLBackend(url)),
        samværsavtale:
            sammeAdresse === YesOrNo.NO &&
            søkersRelasjonTilBarnet !== SøkersRelasjonTilBarnet.FOSTERFORELDER &&
            samværsavtale &&
            samværsavtale.length > 0
                ? samværsavtale.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!)
                : undefined,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
    };

    return apiData;
};
