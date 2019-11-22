import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import SelectBase, { SelectBaseProps } from '../../../../common/form-components/select-base/SelectBase';
import { SelectProps } from 'nav-frontend-skjema';

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
        {({ field, form: { errors, submitCount } }: FieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
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
