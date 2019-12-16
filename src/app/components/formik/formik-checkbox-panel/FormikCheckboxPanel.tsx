import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../utils/navFrontendUtils';
import { CheckboksPanel, CheckboksPanelProps } from 'nav-frontend-skjema';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { showValidationErrors } from 'app/utils/formikUtils';

interface FormikCheckboxProps<T> {
    validate?: FormikValidateFunction;
    afterOnChange?: (newValue: boolean) => void;
    name: T;
}

const FormikCheckboxPanel = <T extends {}>(): React.FunctionComponent<CheckboksPanelProps &
    FormikCheckboxProps<T> &
    FormikValidationProps> => ({ name, label, validate, afterOnChange, intl, ...otherInputProps }) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <CheckboksPanel
                    label={label}
                    inputProps={name}
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

export default FormikCheckboxPanel;
