import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common/lib/common/utils/commonFieldErrorRenderer';
import FormBlock from 'common/components/form-block/FormBlock';
import { getStepConfig } from '../../config/stepConfig';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { getStepTexts } from '../../utils/stepUtils';
import AppForm from '../app-form/AppForm';
import Step, { StepProps } from '../step/Step';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
}

type Props = FormikStepProps & StepProps;

const FormikStep: React.FunctionComponent<Props> = (props) => {
    const formik = useFormikContext<OmsorgspengesøknadFormData>();
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id } = props;
    const stepConfig = getStepConfig(formik.values);
    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step stepConfig={stepConfig} {...props}>
            <AppForm.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
                <FormBlock>
                    <Knapp
                        type="hoved"
                        htmlType="submit"
                        className={'step__button'}
                        spinner={showButtonSpinner || false}
                        disabled={buttonDisabled || false}
                        aria-label={texts.nextButtonAriaLabel}>
                        {texts.nextButtonLabel}
                    </Knapp>
                </FormBlock>
            </AppForm.Form>
        </Step>
    );
};

export default FormikStep;
