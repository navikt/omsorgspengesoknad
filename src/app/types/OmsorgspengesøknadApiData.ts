import { Locale } from '../../common/types/Locale';
import { SøkersRelasjonTilBarnet, Arbeidssituasjon } from './OmsorgspengesøknadFormData';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    fodselsnummer: string | null;
    alternativ_id: string | null;
    aktoer_id: string | null;
}

interface Medlemskap {
    har_bodd_i_utlandet_siste_12_mnd: boolean;
    skal_bo_i_utlandet_neste_12_mnd: boolean;
}

export interface OmsorgspengesøknadApiData {
    new_version: boolean;
    sprak: Locale;
    er_yrkesaktiv: boolean;
    kronisk_eller_funksjonshemming: boolean;
    barn: BarnToSendToApi;
    samme_adresse?: boolean;
    relasjon_til_barnet: SøkersRelasjonTilBarnet | undefined;
    arbeidssituasjon: Arbeidssituasjon[];
    legeerklaring: string[];
    samvarsavtale?: string[];
    medlemskap: Medlemskap;
    har_forstatt_rettigheter_og_plikter: boolean;
    har_bekreftet_opplysninger: boolean;
}
