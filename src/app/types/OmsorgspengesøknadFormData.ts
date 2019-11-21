import { YesOrNo } from '../../common/types/YesOrNo';
import { Attachment } from '../../common/types/Attachment';

export enum Field {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    barnetHarIkkeFåttFødselsnummerEnda = 'barnetHarIkkeFåttFødselsnummerEnda',
    barnetsNavn = 'barnetsNavn',
    barnetsFødselsnummer = 'barnetsFødselsnummer',
    barnetsForeløpigeFødselsnummerEllerDNummer = 'barnetsForeløpigeFødselsnummerEllerDNummer',
    barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    søkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    legeerklæring = 'legeerklæring',
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd'
}

export interface OmsorgspengesøknadFormData {
    [Field.harForståttRettigheterOgPlikter]: boolean;
    [Field.harBekreftetOpplysninger]: boolean;
    [Field.barnetsNavn]: string;
    [Field.barnetsFødselsnummer]: string;
    [Field.søkersRelasjonTilBarnet]: string;
    [Field.søknadenGjelderEtAnnetBarn]: boolean;
    [Field.barnetSøknadenGjelder]: string;
    [Field.periodeFra]?: Date;
    [Field.periodeTil]?: Date;
    [Field.legeerklæring]: Attachment[];
    [Field.barnetHarIkkeFåttFødselsnummerEnda]: boolean;
    [Field.barnetsForeløpigeFødselsnummerEllerDNummer]: string;
    [Field.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [Field.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
}

export const initialValues: OmsorgspengesøknadFormData = {
    [Field.barnetsNavn]: '',
    [Field.barnetsFødselsnummer]: '',
    [Field.barnetSøknadenGjelder]: '',
    [Field.harForståttRettigheterOgPlikter]: false,
    [Field.harBekreftetOpplysninger]: false,
    [Field.søkersRelasjonTilBarnet]: '',
    [Field.søknadenGjelderEtAnnetBarn]: false,
    [Field.legeerklæring]: [],
    [Field.barnetHarIkkeFåttFødselsnummerEnda]: false,
    [Field.barnetsForeløpigeFødselsnummerEllerDNummer]: '',
    [Field.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [Field.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED
};
