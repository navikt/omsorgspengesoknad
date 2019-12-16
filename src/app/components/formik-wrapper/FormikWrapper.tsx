import * as React from 'react';
import { Formik } from 'formik';
import { initialValues, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { CustomFormikProps } from '../../types/FormikProps';

interface FormikWrapperProps {
    contentRenderer: (formikProps: CustomFormikProps) => JSX.Element;
}

const FormikWrapper: React.FunctionComponent<FormikWrapperProps> = ({ contentRenderer }) => (
    <Formik
        initialValues={initialValues}
        onSubmit={(values: OmsorgspengesøknadFormData, { setSubmitting, setFormikState, setTouched }: FormikBag) => {
            setSubmitting(false);
            setTouched({});
        }}
        render={contentRenderer}
    />
);

export default FormikWrapper;
