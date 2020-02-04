import { Locale } from '../../common/types/Locale';
import { SøkersRelasjonTilBarnet, Arbeidssituasjon } from './OmsorgspengesøknadFormData';
import { ApiStringDate } from 'common/types/ApiStringDate';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    fødselsnummer: string | null;
    alternativ_id: string | null;
    aktør_id: string | null;
}

interface Medlemskap {
    har_bodd_i_utlandet_siste_12_mnd: boolean;
    skal_bo_i_utlandet_neste_12_mnd: boolean;
    utenlandsopphold_neste_12_mnd: UtenlandsoppholdApiData[];
    utenlandsopphold_siste_12_mnd: UtenlandsoppholdApiData[];
}

export interface UtenlandsoppholdApiData {
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export interface OmsorgspengesøknadApiData {
    new_version: boolean;
    språk: Locale;
    er_yrkesaktiv: boolean;
    kronisk_eller_funksjonshemming: boolean;
    barn: BarnToSendToApi;
    samme_adresse?: boolean;
    relasjon_til_barnet: SøkersRelasjonTilBarnet | undefined;
    arbeidssituasjon: Arbeidssituasjon[];
    legeerklæring: string[];
    samvarsavtale?: string[];
    medlemskap: Medlemskap;
    har_forstatt_rettigheter_og_plikter: boolean;
    har_bekreftet_opplysninger: boolean;
}
