import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../utils/navFrontendUtils';
import { Checkbox, CheckboxProps } from 'nav-frontend-skjema';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { showValidationErrors } from 'app/utils/formikUtils';

interface FormikCheckboxProps<T> {
    validate?: FormikValidateFunction;
    afterOnChange?: (newValue: boolean) => void;
    name: T;
}

const FormikCheckbox = <T extends {}>(): React.FunctionComponent<CheckboxProps &
    FormikCheckboxProps<T> &
    FormikValidationProps> => ({ name, label, validate, afterOnChange, intl, ...otherInputProps }) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <Checkbox
                    label={label}
                    name={name}
                    {...otherInputProps}
                    {...errorMsgProps}
                    {...field}
                    checked={field.value === true}
                    onChange={() => {
                        const newValue = !field.value;
                        setFieldValue(field.name, newValue);
                        if (afterOnChange) {
                            afterOnChange(newValue);
                        }
                    }}
                />
            );
        }}
    </Field>
);

export default FormikCheckbox;
