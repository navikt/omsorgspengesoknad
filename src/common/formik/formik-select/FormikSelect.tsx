import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { SelectProps } from 'nav-frontend-skjema';
import { showValidationErrors } from 'app/utils/formikUtils';
import SelectBase, { SelectBaseProps } from 'common/form-components/select-base/SelectBase';
import { useIntl } from 'react-intl';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { FormikValidationProps } from '../FormikProps';

interface FormikSelectProps<T> extends SelectBaseProps {
    name: T;
}

type Props = SelectProps & FormikValidationProps;

function FormikSelect<T>({ label, name, children, validate, ...otherInputProps }: Props & FormikSelectProps<T>) {
    const intl = useIntl();
    return (
        <Field validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount } }: FieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <SelectBase
                        label={label}
                        {...otherInputProps}
                        {...errorMsgProps}
                        {...field}
                        value={field.value === undefined ? '' : field.value}>
                        {children}
                    </SelectBase>
                );
            }}
        </Field>
    );
}

export default FormikSelect;
