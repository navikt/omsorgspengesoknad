import { FormikProps } from 'formik';
import { OmsorgspengesøknadFormData } from './OmsorgspengesøknadFormData';
import { InjectedIntlProps } from 'react-intl';
import { FieldValidationResult } from 'app/validation/types';

export type CustomFormikProps = FormikProps<OmsorgspengesøknadFormData> & { submitForm: () => Promise<void> };

export type FieldArrayReplaceFn = (index: number, value: any) => void;
export type FieldArrayPushFn = (obj: any) => void;
export type FieldArrayRemoveFn = (index: number) => undefined;

export interface FormikValidationProps extends InjectedIntlProps {
    validate?: FormikValidateFunction;
}
export type FormikInputValidationResult = FieldValidationResult | string | Promise<void> | undefined;
export type FormikValidateFunction = (value: any) => FormikInputValidationResult;
