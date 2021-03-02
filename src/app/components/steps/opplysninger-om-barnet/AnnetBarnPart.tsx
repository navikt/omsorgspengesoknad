import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateFødselsnummer } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { AppFormField, SøkersRelasjonTilBarnet } from '../../../types/OmsorgspengesøknadFormData';
import { validateNavn, validateRelasjonTilBarnet } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

const AnnetBarnPart: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <>
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={AppFormField.barnetsFødselsnummer}
                    validate={validateFødselsnummer}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />
            </FormBlock>

            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.navn')}
                    name={AppFormField.barnetsNavn}
                    validate={validateNavn}
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
