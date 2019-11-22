import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import {
    validateForeløpigFødselsnummer,
    validateFødselsnummer,
    validateNavn,
    validateRelasjonTilBarnet,
    validateValgtBarn,
    validateYesOrNoIsAnswered
} from '../../../validation/fieldValidations';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { CustomFormikProps } from '../../../types/FormikProps';
import { formatName } from '../../../../common/utils/personUtils';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import Checkbox from '../../form-elements/checkbox/Checkbox';
import Input from '../../form-elements/input/Input';
import FormikStep from '../../formik-step/FormikStep';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import RadioPanelGroup from '../../form-elements/radio-panel-group/RadioPanelGroup';
import { resetFieldValue, resetFieldValues } from '../../../utils/formikUtils';
import { prettifyDate } from '../../../../common/utils/dateUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import { YesOrNo } from '../../../../common/types/YesOrNo';
import Box from '../../../../common/components/box/Box';
import CounsellorPanel from '../../../../common/components/counsellor-panel/CounsellorPanel';

interface OpplysningerOmBarnetStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const canShowSubmitButton = (values: OmsorgspengesøknadFormData): boolean => {
    if (values[AppFormField.sammeAdresse] === YesOrNo.NO && values[AppFormField.delerOmsorg] === YesOrNo.NO) {
        return false;
    }
    return true;
};

const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    formikProps,
    nextStepRoute,
    history,
    intl
}: Props) => {
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
            formValues={values}
            showSubmitButton={canShowSubmitButton(values)}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    harRegistrerteBarn(søkerdata) && (
                        <>
                            <RadioPanelGroup
                                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                                name={AppFormField.barnetSøknadenGjelder}
                                radios={søkerdata.barn.map((barn) => {
                                    const { fornavn, mellomnavn, etternavn, fodselsdato, aktoer_id } = barn;
                                    const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                                    return {
                                        value: aktoer_id,
                                        key: aktoer_id,
                                        label: (
                                            <>
                                                <Normaltekst>{barnetsNavn}</Normaltekst>
                                                <Normaltekst>
                                                    <FormattedMessage
                                                        id="steg.omBarnet.hvilketBarn.født"
                                                        values={{ dato: prettifyDate(fodselsdato) }}
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
                            <Checkbox
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
                            <Input
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
                            <Checkbox
                                label={intlHelper(intl, 'steg.omBarnet.fnr.ikkeFnrEnda')}
                                name={AppFormField.barnetHarIkkeFåttFødselsnummerEnda}
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        setFieldValue(AppFormField.barnetsFødselsnummer, '');
                                    }
                                }}
                            />
                            {barnetHarIkkeFåttFødselsnummerEnda && (
                                <Input
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
                            <Input
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
                            <Input
                                label={intlHelper(intl, 'steg.omBarnet.relasjon')}
                                name={AppFormField.søkersRelasjonTilBarnet}
                                validate={validateRelasjonTilBarnet}
                                bredde="XL"
                                helperText={intlHelper(intl, 'steg.omBarnet.relasjon.eksempel')}
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>
            {(hasChosenRegisteredChild ||
                søknadenGjelderEtAnnetBarn === true ||
                values[AppFormField.sammeAdresse] !== undefined) /** Do not hide if user has already answered */ && (
                <>
                    <Box margin="xl">
                        <YesOrNoQuestion
                            legend="Er du folkeregistrert på samme adresse som barnet?"
                            name={AppFormField.sammeAdresse}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </Box>
                    {values[AppFormField.sammeAdresse] === YesOrNo.NO && (
                        <Box>
                            <YesOrNoQuestion
                                legend="Deler du omsorgen med den andre forelderen?"
                                name={AppFormField.delerOmsorg}
                                validate={validateYesOrNoIsAnswered}
                            />
                            {values[AppFormField.delerOmsorg] === YesOrNo.YES && (
                                <Box>
                                    <CounsellorPanel>Info om å laste opp avtale senere i prosessen</CounsellorPanel>
                                </Box>
                            )}

                            {values[AppFormField.delerOmsorg] === YesOrNo.NO && (
                                <Box>
                                    <CounsellorPanel>Info om at dette er et krav</CounsellorPanel>
                                </Box>
                            )}
                        </Box>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default injectIntl(OpplysningerOmBarnetStep);
