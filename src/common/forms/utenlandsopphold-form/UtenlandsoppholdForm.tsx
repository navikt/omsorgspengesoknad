import React, { useState } from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { getValidationErrorPropsWithIntl } from 'app/utils/navFrontendUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import DatepickerBase from 'common/form-components/datepicker-base/DatepickerBase';
import CountrySelect from 'common/components/country-select/CountrySelect';
import bemUtils from 'common/utils/bemUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import validation from './utenlandsoppholdFormValidation';

import './utenlandsoppholdForm.less';

interface FormLabels {
    title: string;
    fromDate: string;
    toDate: string;
    country: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    values?: UtenlandsoppholdFormValues;
    labels?: FormLabels;
    onSubmit: (values: UtenlandsoppholdFormValues) => void;
    onCancel: () => void;
}

export interface UtenlandsoppholdFormValues {
    fromDate: Date;
    toDate: Date;
    country: string;
}

export enum UtenlandsoppholdFields {
    fromDate = 'fromDate',
    toDate = 'toDate',
    country = 'country'
}

const defaultLabels: FormLabels = {
    title: 'Utenlandsopphold',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    country: 'Hvilket land',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

const bem = bemUtils('utenlandsoppholdForm');

const defaultFormValues: Partial<UtenlandsoppholdFormValues> = {};

const UtenlandsoppholdForm: React.FunctionComponent<Props & InjectedIntlProps> = ({
    intl,
    maxDate,
    minDate,
    labels = defaultLabels,
    values: initialValues = defaultFormValues,
    onSubmit,
    onCancel
}) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (formValues: UtenlandsoppholdFormValues) => {
        onSubmit(formValues);
    };

    return (
        <Formik initialValues={initialValues} onSubmit={onFormikSubmit} validateOnChange={true} validateOnMount={true}>
            {({ handleSubmit, values, isValid, errors }) => (
                <form onSubmit={handleSubmit} className={bem.block}>
                    <div>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">{labels.title}</Systemtittel>
                        </Box>
                        <Field
                            name={UtenlandsoppholdFields.fromDate}
                            validate={(date: Date) => validation.validateFom(date, values)}>
                            {({ field, form: { setFieldValue } }: FieldProps) => {
                                const errorMsgProps = showErrors
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : null;

                                return (
                                    <DatepickerBase
                                        id="utenlandsoppholdStart"
                                        value={field.value}
                                        name={field.name}
                                        label={labels.fromDate}
                                        onChange={(date) => {
                                            setFieldValue(field.name, date);
                                        }}
                                        {...errorMsgProps}
                                        dateLimitations={{
                                            minDato: minDate,
                                            maksDato: values.toDate || maxDate
                                        }}
                                    />
                                );
                            }}
                        </Field>
                        <Field
                            name={UtenlandsoppholdFields.toDate}
                            validate={(date: Date) => validation.validateTom(date, values)}>
                            {({ field, form: { setFieldValue } }: FieldProps) => {
                                const errorMsgProps = showErrors
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : null;
                                return (
                                    <DatepickerBase
                                        id="utenlandsoppholdStop"
                                        value={field.value}
                                        name={field.name}
                                        label={labels.toDate}
                                        onChange={(date) => setFieldValue(field.name, date)}
                                        {...errorMsgProps}
                                        dateLimitations={{
                                            minDato: values.fromDate || minDate,
                                            maksDato: maxDate
                                        }}
                                    />
                                );
                            }}
                        </Field>

                        <Field name={UtenlandsoppholdFields.country} validate={validation.validateCountry}>
                            {({ field, form: { setFieldValue } }: FieldProps) => {
                                const errorMsgProps = showErrors
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : null;
                                return (
                                    <CountrySelect
                                        name={field.name}
                                        label={labels.country}
                                        defaultValue={field.value}
                                        onChange={(country) => setFieldValue(UtenlandsoppholdFields.country, country)}
                                        {...errorMsgProps}
                                    />
                                );
                            }}
                        </Field>
                        <div className={bem.element('knapper')}>
                            <Knapp
                                type="hoved"
                                htmlType="button"
                                onClick={() => {
                                    setShowErrors(true);
                                    if (isValid) {
                                        onFormikSubmit(values as UtenlandsoppholdFormValues);
                                    }
                                }}>
                                {labels.okButton}
                            </Knapp>
                            <Knapp type="flat" htmlType="button" onClick={() => onCancel()}>
                                {labels.cancelButton}
                            </Knapp>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default injectIntl(UtenlandsoppholdForm);
