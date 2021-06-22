import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { getStepConfig } from '../../config/stepConfig';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { getStepTexts } from '../../utils/stepUtils';
import AppForm from '../app-form/AppForm';
import Step, { StepProps } from '../step/Step';

const bem = bemUtils('step');

export interface FormikStepProps {
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

    useLogSidevisning(props.id);

    return (
        <Step stepConfig={stepConfig} {...props}>
            <AppForm.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                formErrorHandler={intlFormErrorHandler(intl, 'validation')}
                runDelayedFormValidation={true}
                includeValidationSummary={true}
                formFooter={
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
                }>
                {children}
            </AppForm.Form>
        </Step>
    );
};

export default FormikStep;
