import * as React from 'react';
import { ArrayHelpers, Field, FieldArray, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../utils/navFrontendUtils';
import FileInputBase from '../../../../common/form-components/file-input-base/FileInputBase';
import { FormikValidationProps } from 'app/types/FormikProps';
import { showValidationErrors } from 'app/utils/formikUtils';

export interface FormikFileInputProps<T> {
    name: T;
    label: string;
    acceptedExtensions: string;
    onFilesSelect: (files: File[], arrayHelpers: ArrayHelpers) => void;
    onClick?: () => void;
}

const FormikFileInput = <T extends {}>(): React.FunctionComponent<FormikFileInputProps<T> & FormikValidationProps> => ({
    label,
    name,
    acceptedExtensions,
    validate,
    onFilesSelect,
    intl,
    onClick
}) => (
    <FieldArray
        name={`${name}`}
        render={(arrayHelpers) => (
            <Field validate={validate} name={name}>
                {({ field, form: { errors, status, submitCount } }: FieldProps) => {
                    const errorMsgProps = showValidationErrors(status, submitCount)
                        ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                        : {};
                    return (
                        <FileInputBase
                            id={field.name}
                            name={field.name}
                            label={label}
                            onClick={onClick}
                            onFilesSelect={(files) => onFilesSelect(files, arrayHelpers)}
                            multiple={true}
                            acceptedExtensions={acceptedExtensions}
                            {...errorMsgProps}
                        />
                    );
                }}
            </Field>
        )}
    />
);

export default FormikFileInput;
