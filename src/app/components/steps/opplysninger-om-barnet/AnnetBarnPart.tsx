import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
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
                    validate={getFødselsnummerValidator({ required: true, disallowedValues: [søkersFnr] })}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />
            </FormBlock>
            <FormBlock>
                <AppForm.Input
                    label={intlHelper(intl, 'steg.omBarnet.navn')}
                    name={AppFormField.barnetsNavn}
                    validate={getStringValidator({ required: false, maxLength: 50 })}
                    bredde="XL"
                />
            </FormBlock>
            <FormBlock>
                <AppForm.Select
                    bredde="xl"
                    label={intlHelper(intl, 'steg.omBarnet.relasjon')}
                    name={AppFormField.søkersRelasjonTilBarnet}
                    validate={getRequiredFieldValidator()}>
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
