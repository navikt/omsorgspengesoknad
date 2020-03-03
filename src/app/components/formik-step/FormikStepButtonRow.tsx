import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from '../form-block/FormBlock';

interface Props {
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    nextButtonLabel: string;
    nextButtonAriaLabel?: string;
}

const FormikStepButtonRow: React.FunctionComponent<Props> = ({
    nextButtonLabel,
    nextButtonAriaLabel,
    buttonDisabled,
    showButtonSpinner
}) => {
    return (
        <FormBlock>
            <Knapp
                type="hoved"
                htmlType="submit"
                className={'step__button'}
                spinner={showButtonSpinner || false}
                disabled={buttonDisabled || false}
                aria-label={nextButtonAriaLabel}>
                {nextButtonLabel}
            </Knapp>
        </FormBlock>
    );
};

export default FormikStepButtonRow;
