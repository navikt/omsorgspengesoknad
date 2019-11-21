import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationUtils';
import { Field } from '../../../types/OmsorgspengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { date3YearsAgo } from '../../../utils/dateUtils';
import { validateFradato, validateTildato } from '../../../validation/fieldValidations';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { CustomFormikProps } from '../../../types/FormikProps';

interface OpplysningerOmTidsromStepState {
    isLoadingNextStep: boolean;
}

interface OpplysningerOmTidsromStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

class OpplysningerOmTidsromStep extends React.Component<Props, OpplysningerOmTidsromStepState> {
    constructor(props: Props) {
        super(props);

        this.finishStep = this.finishStep.bind(this);
        this.validateFraDato = this.validateFraDato.bind(this);
        this.validateTilDato = this.validateTilDato.bind(this);

        this.state = {
            isLoadingNextStep: false
        };
    }

    async finishStep(søkerdata: Søkerdata) {
        this.setState({ isLoadingNextStep: true });

        const { nextStepRoute } = this.props;
        if (nextStepRoute) {
            navigateTo(nextStepRoute, this.props.history);
        }
    }

    validateFraDato(fraDato?: Date) {
        const { periodeTil } = this.props.formikProps.values;
        return validateFradato(fraDato, periodeTil);
    }

    validateTilDato(tilDato?: Date) {
        const { periodeFra } = this.props.formikProps.values;
        return validateTildato(tilDato, periodeFra);
    }

    render() {
        const { history, intl, formikProps, ...stepProps } = this.props;
        const { isLoadingNextStep } = this.state;

        const fraDato = this.props.formikProps.values[Field.periodeFra];
        const tilDato = this.props.formikProps.values[Field.periodeTil];

        return (
            <SøkerdataContextConsumer>
                {(søkerdata) => (
                    <FormikStep
                        id={StepID.TIDSROM}
                        onValidFormSubmit={() => this.finishStep(søkerdata!)}
                        showButtonSpinner={isLoadingNextStep}
                        formValues={formikProps.values}
                        handleSubmit={formikProps.handleSubmit}
                        history={history}
                        {...stepProps}>
                        <DateIntervalPicker
                            legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                            helperText={intlHelper(intl, 'steg.tidsrom.hjelpetekst')}
                            fromDatepickerProps={{
                                label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.fom'),
                                validate: this.validateFraDato,
                                name: Field.periodeFra,
                                dateLimitations: {
                                    minDato: date3YearsAgo.toDate(),
                                    maksDato: this.validateTilDato(tilDato) === undefined ? tilDato : undefined
                                }
                            }}
                            toDatepickerProps={{
                                label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                                validate: this.validateTilDato,
                                name: Field.periodeTil,
                                dateLimitations: {
                                    minDato:
                                        this.validateFraDato(fraDato) === undefined ? fraDato : date3YearsAgo.toDate()
                                }
                            }}
                        />
                    </FormikStep>
                )}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(OpplysningerOmTidsromStep);
