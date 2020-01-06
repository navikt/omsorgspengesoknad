import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../../common/utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import SelectBase, { SelectBaseProps } from '../../../../common/form-components/select-base/SelectBase';
import { SelectProps } from 'nav-frontend-skjema';
import { showValidationErrors } from 'app/utils/formikUtils';

interface FormikSelectProps<T> extends SelectBaseProps {
    name: T;
}

type Props = SelectProps & FormikValidationProps;

const FormikSelect = <T extends {}>(): React.FunctionComponent<Props & FormikSelectProps<T>> => ({
    label,
    name,
    children,
    validate,
    intl,
    ...otherInputProps
}) => (
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

export default FormikSelect;
