import * as React from 'react';
import { BekreftCheckboksPanel as NAVConfirmationCheckboxPanel } from 'nav-frontend-skjema';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../utils/navFrontendUtils';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';

interface FormikConfirmationCheckboxPanelProps<T> {
    label: string;
    name: T;
    validate?: FormikValidateFunction;
    children?: React.ReactNode | React.ReactChildren;
}

const FormikConfirmationCheckboxPanel = <T extends {}>(): React.FunctionComponent<
    FormikConfirmationCheckboxPanelProps<T> & FormikValidationProps
> => ({ children, label, name, validate, intl }) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <NAVConfirmationCheckboxPanel
                    className="skjemaelement"
                    children={children}
                    checked={field.value === true}
                    label={label}
                    inputProps={{ name: `${name}`, id: `${name}` }}
                    {...field}
                    {...errorMsgProps}
                    onChange={() => {
                        setFieldValue(`${name}`, !field.value);
                    }}
                />
            );
        }}
    </Field>
);

export default FormikConfirmationCheckboxPanel;
