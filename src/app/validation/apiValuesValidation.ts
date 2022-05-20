import { IntlShape } from 'react-intl';
import { SoknadApiData } from '../types/SoknadApiData';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepID } from '../soknad/soknadStepsConfig';

export interface ApiValidationError extends FeiloppsummeringFeil {
    stepId: StepID;
}

export const isBarnApiDataValid = (values: SoknadApiData): boolean => {
    const validereBarn = values.barn.navn
        ? values.barn.aktørId
            ? true
            : values.barn.norskIdentifikator && values.relasjonTilBarnet
            ? true
            : false
        : false;
    const validateSammeAdresseSvar = values.sammeAdresse !== undefined;
    const validateKroniskEllerFunksjonshemmingSvar = values.kroniskEllerFunksjonshemming !== undefined;

    return validereBarn && validateKroniskEllerFunksjonshemmingSvar && validateSammeAdresseSvar;
};

export const isDeltBostedApiDataValid = (values: SoknadApiData): boolean => {
    const validerSamværsavtale = values.samværsavtale !== undefined && values.samværsavtale.length > 0;
    return values.sammeAdresse === false ? validerSamværsavtale : true;
};

export const validateApiValues = (values: SoknadApiData, intl: IntlShape): ApiValidationError[] | undefined => {
    const errors: ApiValidationError[] = [];

    if (!isBarnApiDataValid(values)) {
        errors.push({
            skjemaelementId: 'opplysnyngerOmBarnet',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.opplysnyngerOmBarnet'),
            stepId: StepID.OPPLYSNINGER_OM_BARNET,
        });
    }

    /*if (!isDeltBostedApiDataValid(values)) {
        errors.push({
            skjemaelementId: 'deltBostedAvtale',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.deltBostedAvtale'),
            stepId: StepID.DELT_BOSTED,
        });
    }*/

    return errors.length > 0 ? errors : undefined;
};
