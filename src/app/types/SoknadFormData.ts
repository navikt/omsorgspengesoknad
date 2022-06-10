import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum SøkersRelasjonTilBarnet {
    'MOR' = 'mor',
    'FAR' = 'far',
    'ADOPTIVFORELDER' = 'adoptivforelder',
    'FOSTERFORELDER' = 'fosterforelder',
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    barnetsNavn = 'barnetsNavn',
    barnetsFødselsnummer = 'barnetsFødselsnummer',
    barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    søkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    legeerklæring = 'legeerklæring',
    kroniskEllerFunksjonshemming = 'kroniskEllerFunksjonshemming',
    sammeAdresse = 'sammeAdresse',
    samværsavtale = 'samværsavtale',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.kroniskEllerFunksjonshemming]: YesOrNo;
    [SoknadFormField.barnetsNavn]: string;
    [SoknadFormField.barnetsFødselsnummer]: string;
    [SoknadFormField.søkersRelasjonTilBarnet]?: SøkersRelasjonTilBarnet;
    [SoknadFormField.søknadenGjelderEtAnnetBarn]: boolean;
    [SoknadFormField.barnetSøknadenGjelder]: string;
    [SoknadFormField.sammeAdresse]?: YesOrNo;
    [SoknadFormField.legeerklæring]: Attachment[];
    [SoknadFormField.samværsavtale]: Attachment[];
}

export const initialValues: SoknadFormData = {
    [SoknadFormField.kroniskEllerFunksjonshemming]: YesOrNo.UNANSWERED,
    [SoknadFormField.barnetsNavn]: '',
    [SoknadFormField.barnetsFødselsnummer]: '',
    [SoknadFormField.barnetSøknadenGjelder]: '',
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.søkersRelasjonTilBarnet]: undefined,
    [SoknadFormField.søknadenGjelderEtAnnetBarn]: false,
    [SoknadFormField.legeerklæring]: [],
    [SoknadFormField.samværsavtale]: [],
};
