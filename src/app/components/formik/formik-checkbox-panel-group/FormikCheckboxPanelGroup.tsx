import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../utils/navFrontendUtils';
import CheckboxPanelGroupBase, {
    CheckboxPanelExpandedContentRenderer
} from '../../../../common/form-components/checkbox-panel-group-base/CheckboxPanelGroupBase';
import { removeElementFromArray } from '../../../../common/utils/listUtils';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { isCheckboxChecked, showValidationErrors } from 'app/utils/formikUtils';

interface FormikCheckboxPanelProps {
    label: string;
    value: any;
    key?: string;
    disabled?: boolean;
    expandedContentRenderer?: CheckboxPanelExpandedContentRenderer;
}

interface FormikCheckboxPanelGroupProps<T> {
    legend: string;
    name: T;
    checkboxes: FormikCheckboxPanelProps[];
    validate?: FormikValidateFunction;
    helperText?: string;
    valueKey?: string;
    singleColumn?: boolean;
}

const FormikCheckboxPanelGroup = <T extends {}>(): React.FunctionComponent<FormikCheckboxPanelGroupProps<T> &
    FormikValidationProps> => ({
    name,
    validate,
    legend,
    checkboxes,
    singleColumn: columns,
    helperText,
    intl,
    valueKey
}) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, status, submitCount, setFieldValue } }: FieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <CheckboxPanelGroupBase
                    legend={legend}
                    checkboxes={checkboxes.map(({ value, ...otherProps }) => ({
                        checked: isCheckboxChecked(field.value, value, valueKey),
                        onChange: () => {
                            if (isCheckboxChecked(field.value, value, valueKey)) {
                                setFieldValue(`${name}`, removeElementFromArray(value, field.value, valueKey));
                            } else {
                                field.value.push(value);
                                setFieldValue(`${name}`, field.value);
                            }
                        },
                        name: `${name}`,
                        value,
                        ...otherProps
                    }))}
                    helperText={helperText}
                    singleColumn={columns}
                    {...errorMsgProps}
                />
            );
        }}
    </Field>
);

export default FormikCheckboxPanelGroup;
