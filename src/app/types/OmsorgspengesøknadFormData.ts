import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum SøkersRelasjonTilBarnet {
    'MOR' = 'mor',
    'FAR' = 'far',
    'ADOPTIVFORELDER' = 'adoptivforelder',
    'FOSTERFORELDER' = 'fosterforelder',
}

export enum AppFormField {
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

export interface OmsorgspengesøknadFormData {
    [AppFormField.harForståttRettigheterOgPlikter]: boolean;
    [AppFormField.harBekreftetOpplysninger]: boolean;
    [AppFormField.kroniskEllerFunksjonshemming]: YesOrNo;
    [AppFormField.barnetsNavn]: string;
    [AppFormField.barnetsFødselsnummer]: string;
    [AppFormField.søkersRelasjonTilBarnet]?: SøkersRelasjonTilBarnet;
    [AppFormField.søknadenGjelderEtAnnetBarn]: boolean;
    [AppFormField.barnetSøknadenGjelder]: string;
    [AppFormField.sammeAdresse]?: YesOrNo;
    [AppFormField.legeerklæring]: Attachment[];
    [AppFormField.samværsavtale]: Attachment[];
}

export const initialValues: OmsorgspengesøknadFormData = {
    [AppFormField.kroniskEllerFunksjonshemming]: YesOrNo.UNANSWERED,
    [AppFormField.barnetsNavn]: '',
    [AppFormField.barnetsFødselsnummer]: '',
    [AppFormField.barnetSøknadenGjelder]: '',
    [AppFormField.harForståttRettigheterOgPlikter]: false,
    [AppFormField.harBekreftetOpplysninger]: false,
    [AppFormField.søkersRelasjonTilBarnet]: undefined,
    [AppFormField.søknadenGjelderEtAnnetBarn]: false,
    [AppFormField.legeerklæring]: [],
    [AppFormField.samværsavtale]: [],
};
