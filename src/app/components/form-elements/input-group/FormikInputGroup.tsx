import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { getValidationErrorPropsWithIntl } from 'app/utils/navFrontendUtils';
import { SkjemaGruppe } from 'nav-frontend-skjema';

import './formikInputGroup.less';

interface Props<T> {
    label: string;
    name: T;
    validate?: FormikValidateFunction;
    children: React.ReactNode;
}

const FormikInputGroup = <T extends {}>(): React.FunctionComponent<Props<T> & FormikValidationProps> => ({
    name,
    label,
    children,
    validate,
    intl
}) => (
    <Field validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <div className="formikInputGroupWrapper" id={field.name} tabIndex={errorMsgProps.feil ? -1 : undefined}>
                    <SkjemaGruppe title={label} feil={errorMsgProps.feil}>
                        {children}
                    </SkjemaGruppe>
                </div>
            );
        }}
    </Field>
);

export default FormikInputGroup;
