import Box from 'common/components/box/Box';
import FormikCheckbox from 'common/formik/formik-checkbox/FormikCheckbox';
import FormikInput from 'common/formik/formik-input/FormikInput';
import FormikRadioPanelGroup from 'common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import FormikSelect from 'common/formik/formik-select/FormikSelect';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { HistoryProps } from 'common/types/History';
import { prettifyDate } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { formatName } from 'common/utils/personUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { CustomFormikProps } from '../../../types/FormikProps';
import { AppFormField, SøkersRelasjonTilBarnet } from '../../../types/OmsorgspengesøknadFormData';
import { Søkerdata } from '../../../types/Søkerdata';
import { resetFieldValue, resetFieldValues } from '../../../utils/formikUtils';
import { navigateTo } from '../../../utils/navigationUtils';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import { validateForeløpigFødselsnummer, validateFødselsnummer, validateNavn, validateRelasjonTilBarnet, validateValgtBarn, validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';




interface OpplysningerOmBarnetStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({ formikProps, nextStepRoute, history }: Props) => {
    const intl = useIntl();
    const { handleSubmit, setFieldValue, values } = formikProps;
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { søknadenGjelderEtAnnetBarn, barnetHarIkkeFåttFødselsnummerEnda } = values;
    const hasChosenRegisteredChild = values[AppFormField.barnetSøknadenGjelder].length > 0;
    return (
        <FormikStep
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onValidFormSubmit={navigate}
            handleSubmit={handleSubmit}
            history={history}
            formValues={values}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    harRegistrerteBarn(søkerdata) && (
                        <>
                            <FormikRadioPanelGroup<AppFormField>
                                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                                description={intlHelper(intl, 'steg.omBarnet.hvilketBarn.info')}
                                name={AppFormField.barnetSøknadenGjelder}
                                radios={søkerdata.barn.map((barn) => {
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
                            <FormikCheckbox<AppFormField>
                                label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                                name={AppFormField.søknadenGjelderEtAnnetBarn}
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        resetFieldValue(AppFormField.barnetSøknadenGjelder, setFieldValue);
                                    } else {
                                        resetFieldValues(
                                            [
                                                AppFormField.barnetsFødselsnummer,
                                                AppFormField.barnetHarIkkeFåttFødselsnummerEnda,
                                                AppFormField.barnetsForeløpigeFødselsnummerEllerDNummer,
                                                AppFormField.barnetsNavn,
                                                AppFormField.søkersRelasjonTilBarnet
                                            ],
                                            setFieldValue
                                        );
                                    }
                                }}
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>

            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    (søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                        <>
                            <FormikInput<AppFormField>
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
                            <FormikCheckbox<AppFormField>
                                label={intlHelper(intl, 'steg.omBarnet.fnr.ikkeFnrEnda')}
                                name={AppFormField.barnetHarIkkeFåttFødselsnummerEnda}
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        setFieldValue(AppFormField.barnetsFødselsnummer, '');
                                    }
                                }}
                            />
                            {barnetHarIkkeFåttFødselsnummerEnda && (
                                <FormikInput<AppFormField>
                                    label={intlHelper(intl, 'steg.omBarnet.fnr.foreløpig')}
                                    name={AppFormField.barnetsForeløpigeFødselsnummerEllerDNummer}
                                    validate={(foreløpigFnr) => {
                                        if (barnetHarIkkeFåttFødselsnummerEnda) {
                                            return validateForeløpigFødselsnummer(foreløpigFnr);
                                        }
                                        return undefined;
                                    }}
                                    bredde="XXL"
                                    type="tel"
                                    maxLength={11}
                                />
                            )}
                            <FormikInput<AppFormField>
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
                            <FormikSelect<AppFormField>
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
                            </FormikSelect>
                        </>
                    )
                }
            </SøkerdataContextConsumer>
            {(hasChosenRegisteredChild ||
                søknadenGjelderEtAnnetBarn === true ||
                values[AppFormField.sammeAdresse] !== undefined) /** Do not hide if user has already answered */ && (
                <>
                    <Box margin="xl">
                        <FormikYesOrNoQuestion<AppFormField>
                            legend="Er du folkeregistrert på samme adresse som barnet?"
                            name={AppFormField.sammeAdresse}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </Box>
                </>
            )}
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
