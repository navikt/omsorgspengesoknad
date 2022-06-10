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
import { SoknadFormField, initialValues, SoknadFormData } from '../../types/SoknadFormData';
import { Barn } from '../../types/Barn';
import SoknadFormComponents from '../SoknadFormComponents';

interface Props {
    søkersBarn: Barn[];
}

const RegistrertBarnPart: React.FunctionComponent<Props> = ({ søkersBarn = [] }) => {
    const intl = useIntl();
    const {
        values: { søknadenGjelderEtAnnetBarn },
        setFieldValue,
    } = useFormikContext<SoknadFormData>();

    return (
        <SkjemagruppeQuestion
            legend={
                <Undertittel tag="h2" style={{ display: 'inline-block', marginBottom: '.75rem', fontSize: '1.125rem' }}>
                    {intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                </Undertittel>
            }>
            <SoknadFormComponents.RadioPanelGroup
                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.registrerteBarn')}
                description={intlHelper(intl, 'steg.omBarnet.hvilketBarn.info')}
                name={SoknadFormField.barnetSøknadenGjelder}
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
                <SoknadFormComponents.Checkbox
                    label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                    name={SoknadFormField.søknadenGjelderEtAnnetBarn}
                    afterOnChange={(newValue) => {
                        if (newValue) {
                            resetFieldValue(SoknadFormField.barnetSøknadenGjelder, setFieldValue, initialValues);
                        } else {
                            resetFieldValues(
                                [
                                    SoknadFormField.barnetsFødselsnummer,
                                    SoknadFormField.barnetsNavn,
                                    SoknadFormField.søkersRelasjonTilBarnet,
                                    SoknadFormField.kroniskEllerFunksjonshemming,
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
