import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { resetFieldValue, resetFieldValues } from '@navikt/sif-common-formik';
import { useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import { prettifyDate } from '@navikt/sif-common/lib/common/utils/dateUtils';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import { formatName } from '@navikt/sif-common/lib/common/utils/personUtils';
import FormBlock from 'common/components/form-block/FormBlock';
import {
    AppFormField, initialValues, OmsorgspengesøknadFormData
} from '../../../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import { validateValgtBarn } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

interface Props {
    søkersBarn: BarnReceivedFromApi[];
}

const RegistrertBarnPart: React.FunctionComponent<Props> = ({ søkersBarn = [] }) => {
    const intl = useIntl();
    const {
        values: { søknadenGjelderEtAnnetBarn },
        setFieldValue
    } = useFormikContext<OmsorgspengesøknadFormData>();

    return (
        <>
            <AppForm.RadioPanelGroup
                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                description={intlHelper(intl, 'steg.omBarnet.hvilketBarn.info')}
                name={AppFormField.barnetSøknadenGjelder}
                useTwoColumns={true}
                radios={søkersBarn.map((barn) => {
                    const { fornavn, mellomnavn, etternavn, fødselsdato, aktørId } = barn;
                    const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                    return {
                        value: aktørId,
                        key: aktørId,
                        label: (
                            <>
                                <Normaltekst>{barnetsNavn}</Normaltekst>
                                <Normaltekst>
                                    <FormattedMessage
                                        id="steg.omBarnet.hvilketBarn.født"
                                        values={{ dato: prettifyDate(fødselsdato) }}
                                    />
                                </Normaltekst>
                            </>
                        ),
                        disabled: søknadenGjelderEtAnnetBarn
                    };
                })}
                validate={(value) => {
                    if (søknadenGjelderEtAnnetBarn) {
                        return undefined;
                    }
                    return validateValgtBarn(value);
                }}
            />
            <FormBlock margin="l">
                <AppForm.Checkbox
                    label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                    name={AppFormField.søknadenGjelderEtAnnetBarn}
                    afterOnChange={(newValue) => {
                        if (newValue) {
                            resetFieldValue(AppFormField.barnetSøknadenGjelder, setFieldValue, initialValues);
                        } else {
                            resetFieldValues(
                                [
                                    AppFormField.barnetsFødselsnummer,
                                    AppFormField.barnetHarIkkeFåttFødselsnummerEnda,
                                    AppFormField.barnetsFødselsdato,
                                    AppFormField.barnetsNavn,
                                    AppFormField.søkersRelasjonTilBarnet
                                ],
                                setFieldValue,
                                initialValues
                            );
                        }
                    }}
                />
            </FormBlock>
        </>
    );
};

export default RegistrertBarnPart;
