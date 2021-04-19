import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { resetFieldValue, resetFieldValues, SkjemagruppeQuestion } from '@navikt/sif-common-formik';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AppFormField, initialValues, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import AppForm from '../../app-form/AppForm';

interface Props {
    søkersBarn: BarnReceivedFromApi[];
}

const RegistrertBarnPart: React.FunctionComponent<Props> = ({ søkersBarn = [] }) => {
    const intl = useIntl();
    const {
        values: { søknadenGjelderEtAnnetBarn },
        setFieldValue,
    } = useFormikContext<OmsorgspengesøknadFormData>();

    return (
        <SkjemagruppeQuestion
            legend={
                <Undertittel tag="h2" style={{ display: 'inline-block', marginBottom: '.75rem', fontSize: '1.125rem' }}>
                    {intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                </Undertittel>
            }>
            <AppForm.RadioPanelGroup
                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.registrerteBarn')}
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
                        disabled: søknadenGjelderEtAnnetBarn,
                    };
                })}
                validate={søknadenGjelderEtAnnetBarn ? undefined : getRequiredFieldValidator()}
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
                                    AppFormField.barnetsNavn,
                                    AppFormField.søkersRelasjonTilBarnet,
                                    AppFormField.kroniskEllerFunksjonshemming,
                                ],
                                setFieldValue,
                                initialValues
                            );
                        }
                    }}
                />
            </FormBlock>
        </SkjemagruppeQuestion>
    );
};

export default RegistrertBarnPart;
