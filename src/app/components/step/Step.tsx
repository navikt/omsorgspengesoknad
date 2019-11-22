import * as React from 'react';
import Page from '../../../common/components/page/Page';
import { StepID, StepConfigItemTexts, getStepConfig } from '../../config/stepConfig';
import bemHelper from '../../../common/utils/bemUtils';
import StepIndicator from '../step-indicator/StepIndicator';
import { Hovedknapp as Button } from 'nav-frontend-knapper';
import Box from '../../../common/components/box/Box';
import StepBanner from '../step-banner/StepBanner';
import { Systemtittel } from 'nav-frontend-typografi';
import FormikValidationErrorSummary from '../formik-validation-error-summary/FormikValidationErrorSummary';
import BackLinkWithFormikReset from '../back-link-with-formik-reset/BackLinkWithFormikReset';
import { InjectedIntl, injectIntl } from 'react-intl';
import { getStepTexts } from 'app/utils/stepUtils';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';

import './step.less';
import intlHelper from '../../../common/utils/intlUtils';

const bem = bemHelper('step');

export interface StepProps {
    id: StepID;
    formValues: OmsorgspengesøknadFormData;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    useValidationErrorSummary?: boolean;
    intl: InjectedIntl;
}

const Step: React.FunctionComponent<StepProps> = ({
    id,
    formValues,
    handleSubmit,
    showSubmitButton,
    showButtonSpinner,
    buttonDisabled,
    useValidationErrorSummary,
    intl,
    children
}) => {
    const stepConfig = getStepConfig(formValues);
    const conf = stepConfig[id];
    const stepTexts: StepConfigItemTexts = getStepTexts(intl, id, stepConfig);
    return (
        <Page
            className={bem.block}
            title={stepTexts.pageTitle}
            topContentRenderer={() => (
                <>
                    <StepBanner text={intlHelper(intl, 'banner.title')} />
                    {useValidationErrorSummary !== false && (
                        <FormikValidationErrorSummary className={bem.element('validationErrorSummary')} />
                    )}
                </>
            )}>
            <BackLinkWithFormikReset className={bem.element('backLink')} href={conf.backLinkHref!} />
            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            <Box margin="xxl">
                <Systemtittel className={bem.element('title')}>{stepTexts.stepTitle}</Systemtittel>
            </Box>
            <Box margin="xl">
                <form onSubmit={handleSubmit} noValidate={true}>
                    {children}
                    {showSubmitButton !== false && (
                        <Box margin="xl">
                            <Button
                                className={bem.element('button')}
                                spinner={showButtonSpinner || false}
                                disabled={buttonDisabled || false}
                                aria-label={stepTexts.nextButtonAriaLabel}>
                                {stepTexts.nextButtonLabel}
                            </Button>
                        </Box>
                    )}
                </form>
            </Box>
        </Page>
    );
};

export default injectIntl(Step);
