import * as React from 'react';
import { connect } from 'formik';
import { History } from 'history';
import { userHasSubmittedValidForm } from '@navikt/sif-common/lib/common/formik/formikUtils';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';
import Step, { StepProps } from '../step/Step';

export interface FormikStepProps {
    children: React.ReactNode;
    onValidFormSubmit?: () => void;
    history: History;
    skipValidation?: boolean;
}

type Props = FormikStepProps & StepProps;

type PropsWithFormik = Props & ConnectedFormikProps<AppFormField>;

class FormikStep extends React.Component<PropsWithFormik> {
    constructor(props: PropsWithFormik) {
        super(props);
        this.props.formik.setStatus({ stepSubmitCount: this.props.formik.submitCount });
        const { history } = props;
        history.listen(() => {
            this.props.formik.setStatus({ stepSubmitCount: this.props.formik.submitCount });
        });
    }

    componentDidUpdate(previousProps: PropsWithFormik) {
        const previousValues = {
            isSubmitting: previousProps.formik.isSubmitting,
            isValid: previousProps.formik.isValid
        };
        const currentValues = { isSubmitting: this.props.formik.isSubmitting, isValid: this.props.formik.isValid };
        const { skipValidation } = this.props;

        if (
            userHasSubmittedValidForm(previousValues, currentValues) ||
            (skipValidation && previousValues.isSubmitting === true && currentValues.isSubmitting === false)
        ) {
            const { onValidFormSubmit } = this.props;
            if (onValidFormSubmit) {
                onValidFormSubmit();
            }
        }
    }

    render() {
        return <Step {...this.props} />;
    }
}

export default connect<Props, AppFormField>(FormikStep);
