import { Locale } from '../../common/types/Locale';
import { SøkersRelasjonTilBarnet, Arbeidssituasjon } from './OmsorgspengesøknadFormData';
import { ApiStringDate } from 'common/types/ApiStringDate';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    norskIdentifikator: string | null;
    alternativId: string | null;
    aktørId: string | null;
}

interface Medlemskap {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: UtenlandsoppholdApiData[];
    utenlandsoppholdSiste12Mnd: UtenlandsoppholdApiData[];
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
    arbeidssituasjon: Arbeidssituasjon[];
    legeerklæring: string[];
    samvarsavtale?: string[];
    medlemskap: Medlemskap;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
