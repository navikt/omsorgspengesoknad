import React, { useState } from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Fieldset } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { getValidationErrorPropsWithIntl } from 'app/utils/navFrontendUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import DatepickerBase from 'common/form-components/datepicker-base/DatepickerBase';
import CountrySelect from 'common/components/country-select/CountrySelect';
import bemUtils from 'common/utils/bemUtils';

import './utenlandsoppholdForm.less';

interface FormLabels {
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

interface UtenlandsoppholdFormValues {
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
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    country: 'Hvilket land',
    okButton: 'Ok',
    cancelButton: 'Cancel'
};

const validateFom = (date: Date, values: Partial<UtenlandsoppholdFormValues>) => {
    if (!date) {
        return {
            key: 'fieldvalidation.påkrevd'
        };
    }
    return null;
};

const validateTom = (date: Date, values: Partial<UtenlandsoppholdFormValues>) => {
    if (!date) {
        return {
            key: 'fieldvalidation.påkrevd'
        };
    }
    return null;
};

const validateCountry = (country: string) => {
    if (country) {
        return null;
    }
    return {
        key: 'fieldvalidation.påkrevd'
    };
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
                        <Fieldset legend={'Tidsperiode'}>
                            <div>
                                <Field
                                    name={UtenlandsoppholdFields.fromDate}
                                    validate={(date: Date) => validateFom(date, values)}>
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
                                    validate={(date: Date) => validateTom(date, values)}>
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
                            </div>
                        </Fieldset>
                        <Field name={UtenlandsoppholdFields.country} validate={validateCountry}>
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
