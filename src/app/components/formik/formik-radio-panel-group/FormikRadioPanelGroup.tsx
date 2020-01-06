import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../../../common/utils/navFrontendUtils';
import RadioPanelGroupBase, {
    RadioPanelGroupStyle
} from '../../../../common/form-components/radio-panel-group-base/RadioPanelGroupBase';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { showValidationErrors } from 'app/utils/formikUtils';

interface FormikRadioPanelProps {
    label: React.ReactNode;
    value: string;
    key: string;
    disabled?: boolean;
}

interface FormikRadioPanelGroupProps<T> {
    legend: string;
    name: T;
    description?: string;
    radios: FormikRadioPanelProps[];
    validate?: FormikValidateFunction;
    helperText?: string;
    expandedContentRenderer?: () => React.ReactNode;
    singleColumn?: boolean;
    style?: RadioPanelGroupStyle;
}

const FormikRadioPanelGroup = <T extends {}>(): React.FunctionComponent<FormikRadioPanelGroupProps<T> &
    FormikValidationProps> => ({
    name,
    validate,
    legend,
    radios,
    helperText,
    style,
    singleColumn,
    description,
    expandedContentRenderer,
    intl
}) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, submitCount, status, setFieldValue } }: FieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <RadioPanelGroupBase
                    legend={legend}
                    radios={radios.map(({ value, ...otherProps }) => ({
                        checked: field.value === value,
                        onChange: () => setFieldValue(field.name, value),
                        name: `${name}`,
                        value,
                        ...otherProps
                    }))}
                    description={description}
                    helperText={helperText}
                    expandedContentRenderer={expandedContentRenderer}
                    style={style}
                    singleColumn={singleColumn}
                    {...errorMsgProps}
                />
            );
        }}
    </Field>
);

export default FormikRadioPanelGroup;
