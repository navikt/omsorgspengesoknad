import * as React from 'react';
import NAVStepIndicator from 'nav-frontend-stegindikator/lib/stegindikator';
import { default as Step } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { StepConfigInterface, StepID } from '../../config/stepConfig';
import { useIntl, IntlShape } from 'react-intl';
import { getStepTexts } from 'app/utils/stepUtils';

interface StepIndicatorProps {
    activeStep: number;
    stepConfig: StepConfigInterface;
}

const renderSteps = (stepConfig: StepConfigInterface, intl: IntlShape) =>
    Object.keys(stepConfig).map((stepId) => {
        const { stepIndicatorLabel } = getStepTexts(intl, stepId as StepID, stepConfig);
        const { index } = stepConfig[stepId];
        return <Step label={stepIndicatorLabel} index={index} key={`${stepIndicatorLabel + index}`} />;
    });

const StepIndicator: React.FunctionComponent<StepIndicatorProps> = ({ activeStep, stepConfig }) => {
    const intl = useIntl();
    return (
        <NAVStepIndicator visLabel={false} autoResponsiv={false} aktivtSteg={activeStep}>
            {renderSteps(stepConfig, intl)}
        </NAVStepIndicator>
    );
};

export default StepIndicator;
