import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { SoknadFormField, SøkersRelasjonTilBarnet } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';

interface Props {
    søkersFnr: string;
}

const AnnetBarnPart: React.FunctionComponent<Props> = ({ søkersFnr }: Props) => {
    const intl = useIntl();
    return (
        <>
            <FormBlock>
                <SoknadFormComponents.Input
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={SoknadFormField.barnetsFødselsnummer}
                    validate={getFødselsnummerValidator({ required: true, disallowedValues: [søkersFnr] })}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />
            </FormBlock>
            <FormBlock>
                <SoknadFormComponents.Input
                    label={intlHelper(intl, 'steg.omBarnet.navn')}
                    name={SoknadFormField.barnetsNavn}
                    validate={(value) => {
                        const error = getStringValidator({ required: true, maxLength: 50 })(value);
                        return error ? { key: error, values: { maks: 50 } } : undefined;
                    }}
                    bredde="XL"
                />
            </FormBlock>
            <FormBlock>
                <SoknadFormComponents.Select
                    bredde="xl"
                    label={intlHelper(intl, 'steg.omBarnet.relasjon')}
                    name={SoknadFormField.søkersRelasjonTilBarnet}
                    validate={getRequiredFieldValidator()}>
                    <option />
                    {Object.keys(SøkersRelasjonTilBarnet).map((key) => (
                        <option key={key} value={SøkersRelasjonTilBarnet[key]}>
                            {intlHelper(intl, `relasjonTilBarnet.${SøkersRelasjonTilBarnet[key]}`)}
                        </option>
                    ))}
                </SoknadFormComponents.Select>
            </FormBlock>
        </>
    );
};

export default AnnetBarnPart;
