import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { SøkersRelasjonTilBarnet } from './OmsorgspengesøknadFormData';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    norskIdentifikator: string | null;
    aktørId: string | null;
    fødselsdato: ApiStringDate | null;
}
export interface UtenlandsoppholdApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export interface OmsorgspengesøknadApiData {
    newVersion: boolean;
    språk: Locale;
    erYrkesaktiv: boolean;
    kroniskEllerFunksjonshemming: boolean;
    barn: BarnToSendToApi;
    sammeAdresse?: boolean;
    relasjonTilBarnet: SøkersRelasjonTilBarnet | undefined;
    legeerklæring: string[];
    samværsavtale?: string[];
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
