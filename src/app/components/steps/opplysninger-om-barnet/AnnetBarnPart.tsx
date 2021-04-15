import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateFødselsnummer,
    ValidateFødselsnummerErrors,
    validateRequiredValue,
    validateString,
    ValidateStringErrors,
} from '@navikt/sif-common-formik/lib/validation';
import { AppFormField, SøkersRelasjonTilBarnet } from '../../../types/OmsorgspengesøknadFormData';
import AppForm from '../../app-form/AppForm';

interface Props {
    søkersFnr: string;
}

const AnnetBarnPart: React.FunctionComponent<Props> = ({ søkersFnr }: Props) => {
    const intl = useIntl();

    return (
        <>
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={AppFormField.barnetsFødselsnummer}
                    validate={(value) => {
                        const error = validateFødselsnummer({ required: true, disallowedValues: [søkersFnr] })(value);
                        switch (error) {
                            case undefined:
                                return undefined;
                            case ValidateFødselsnummerErrors.noValue:
                                return intlHelper(intl, 'validation.barnetsFødselsnummer.noValue');
                            case ValidateFødselsnummerErrors.fødselsnummerNot11Chars:
                                return intlHelper(intl, 'validation.barnetsFødselsnummer.ikke11Siffer');
                            case ValidateFødselsnummerErrors.disallowedFødselsnummer:
                                return intlHelper(intl, 'validation.barnetsFødselsnummer.søkersFnrErBrukt');
                            default:
                                return intlHelper(intl, 'validation.barnetsFødselsnummer.ugyldigFormat');
                        }
                    }}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />
            </FormBlock>
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.navn')}
                    name={AppFormField.barnetsNavn}
                    validate={(value) => {
                        const error = validateString({ required: false, maxLength: 50 })(value);
                        switch (error) {
                            case ValidateStringErrors.noValue:
                                return intlHelper(intl, 'validation.barnetsNavn.noValue');
                            case ValidateStringErrors.tooLong:
                                return intlHelper(intl, 'validation.barnetsNavn.tooLong');
                        }
                        return undefined;
                    }}
                    bredde="XL"
                />
            </FormBlock>
            <FormBlock>
                <AppForm.Select
                    bredde="xl"
                    label={intlHelper(intl, 'steg.omBarnet.relasjon')}
                    name={AppFormField.søkersRelasjonTilBarnet}
                    validate={(value) => {
                        const error = validateRequiredValue(value);
                        return error ? intlHelper(intl, 'validation.søkersRelasjonTilBarnet.ikkeValgt') : undefined;
                    }}>
                    <option />
                    {Object.keys(SøkersRelasjonTilBarnet).map((key) => (
                        <option key={key} value={SøkersRelasjonTilBarnet[key]}>
                            {intlHelper(intl, `relasjonTilBarnet.${SøkersRelasjonTilBarnet[key]}`)}
                        </option>
                    ))}
                </AppForm.Select>
            </FormBlock>
        </>
    );
};

export default AnnetBarnPart;
