import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { getStepConfig } from '../../config/stepConfig';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { getStepTexts } from '../../utils/stepUtils';
import AppForm from '../app-form/AppForm';
import Step, { StepProps } from '../step/Step';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';

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

    const constructIntlValidationErrorKey = (error: string, fieldName: string): string =>
        `validation.${fieldName}.${error}`;

    return (
        <Step stepConfig={stepConfig} {...props}>
            <AppForm.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                fieldErrorRenderer={(error, fieldName) => {
                    return intlHelper(intl, constructIntlValidationErrorKey(error, fieldName));
                }}
                summaryFieldErrorRenderer={(error, fieldName) => {
                    const feil: FeiloppsummeringFeil = {
                        skjemaelementId: fieldName,
                        feilmelding: intlHelper(intl, constructIntlValidationErrorKey(error, fieldName)),
                    };
                    return feil;
                }}
                runDelayedFormValidation={true}
                includeValidationSummary={true}>
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
