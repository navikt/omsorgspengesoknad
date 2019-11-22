import * as React from 'react';
import { Field, FieldProps } from 'formik';
import DatepickerBase, { DateLimitiations } from '../../../../common/form-components/datepicker-base/DatepickerBase';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { getValidationErrorPropsWithIntl } from 'app/utils/navFrontendUtils';

export interface FormikDatepickerProps<T> {
    name: T;
    label: string;
    validate?: FormikValidateFunction;
    dateLimitations?: DateLimitiations;
}

const FormikDatepicker = <T extends {}>(): React.FunctionComponent<
    FormikDatepickerProps<T> & FormikValidationProps
> => ({ name, validate, label, dateLimitations, intl, ...otherProps }) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <DatepickerBase
                    id={`${name}`}
                    label={label}
                    value={field.value}
                    dateLimitations={dateLimitations}
                    {...otherProps}
                    {...errorMsgProps}
                    {...field}
                    onChange={(date: Date) => {
                        setFieldValue(field.name, date);
                    }}
                />
            );
        }}
    </Field>
);

export default FormikDatepicker;
