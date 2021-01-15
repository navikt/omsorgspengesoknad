import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import { getStepConfig } from '../../config/stepConfig';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { getStepTexts } from '../../utils/stepUtils';
import AppForm from '../app-form/AppForm';
import Step, { StepProps } from '../step/Step';
import bemUtils from 'common/utils/bemUtils';
import { useLogSidevisning } from '@navikt/sif-common-amplitude/lib';

const bem = bemUtils('step');

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
}

type Props = FormikStepProps & StepProps;

const FormikStep = (props: Props) => {
    const formik = useFormikContext<OmsorgspengesøknadFormData>();
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id } = props;
    const stepConfig = getStepConfig(formik.values);
    const texts = getStepTexts(intl, id, stepConfig);

    useLogSidevisning(props.id);

    return (
        <Step stepConfig={stepConfig} {...props}>
            <AppForm.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                runDelayedFormValidation={true}
                includeValidationSummary={true}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
                <FormBlock>
                    <div className={bem.element('buttonWrapper')}>
                        <Knapp
                            type="hoved"
                            htmlType="submit"
                            className={'step__button'}
                            spinner={showButtonSpinner || false}
                            disabled={buttonDisabled || false}
                            aria-label={texts.nextButtonAriaLabel}>
                            {texts.nextButtonLabel}
                        </Knapp>
                    </div>
                </FormBlock>
            </AppForm.Form>
        </Step>
    );
};

export default FormikStep;
