import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import TextareaBase from '../../../../common/form-components/textarea-base/TextareaBase';
import { TextareaProps } from 'nav-frontend-skjema';

interface FormikTextareaProps<T> {
    name: T;
    helperText?: string;
    maxLength?: number;
}

export type SelectedTextareaProps = Partial<TextareaProps>;

type Props = SelectedTextareaProps & FormikValidationProps;

const FormikTextarea = <T extends {}>(): React.FunctionComponent<Props & FormikTextareaProps<T>> => ({
    label,
    name,
    validate,
    intl,
    ...otherTextareaProps
}) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <TextareaBase
                    label={label}
                    {...otherTextareaProps}
                    {...errorMsgProps}
                    {...field}
                    value={field.value || ''}
                />
            );
        }}
    </Field>
);

export default FormikTextarea;
