import React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateFødselsnummer } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import {
    AppFormField,
    OmsorgspengesøknadFormData,
    SøkersRelasjonTilBarnet,
} from '../../../types/OmsorgspengesøknadFormData';
import { validateFødselsdato, validateNavn, validateRelasjonTilBarnet } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

const AnnetBarnPart: React.FunctionComponent = () => {
    const intl = useIntl();
    const {
        values: { barnetHarIkkeFåttFødselsnummerEnda },
        setFieldValue,
    } = useFormikContext<OmsorgspengesøknadFormData>();
    return (
        <>
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={AppFormField.barnetsFødselsnummer}
                    validate={(fnr) => {
                        if (!barnetHarIkkeFåttFødselsnummerEnda) {
                            return validateFødselsnummer(fnr);
                        }
                        return undefined;
                    }}
                    disabled={barnetHarIkkeFåttFødselsnummerEnda}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />
            </FormBlock>
            <FormBlock margin="m">
                <AppForm.Checkbox
                    label={intlHelper(intl, 'steg.omBarnet.fnr.ikkeFnrEnda')}
                    name={AppFormField.barnetHarIkkeFåttFødselsnummerEnda}
                    afterOnChange={(newValue) => {
                        if (newValue) {
                            setFieldValue(AppFormField.barnetsFødselsnummer, '');
                        }
                    }}
                />
            </FormBlock>
            {barnetHarIkkeFåttFødselsnummerEnda && (
                <FormBlock>
                    <AppForm.DatePicker
                        name={AppFormField.barnetsFødselsdato}
                        maxDate={dateToday}
                        label={intlHelper(intl, 'steg.omBarnet.fødselsdato')}
                        validate={(dato) => {
                            if (barnetHarIkkeFåttFødselsnummerEnda) {
                                return validateFødselsdato(dato);
                            }
                            return undefined;
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.navn')}
                    name={AppFormField.barnetsNavn}
                    validate={(navn) => {
                        if (barnetHarIkkeFåttFødselsnummerEnda) {
                            return validateNavn(navn, false);
                        } else {
                            return validateNavn(navn, true);
                        }
                    }}
                    bredde="XL"
                />
            </FormBlock>
            <FormBlock>
                <AppForm.Select
                    bredde="xl"
                    label={intlHelper(intl, 'steg.omBarnet.relasjon')}
                    name={AppFormField.søkersRelasjonTilBarnet}
                    validate={validateRelasjonTilBarnet}>
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
