import * as React from 'react';
import ValidationErrorSummaryBase, {
    ValidationSummaryError
} from '../validation-error-summary-base/ValidationErrorSummaryBase';
import { connect } from 'formik';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';
import intlHelper from '../../../common/utils/intlUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { renderFieldValidationError, isFieldValidationError } from '../../validation/fieldValidationRenderUtils';
import { flattenFieldArrayErrors, showValidationErrors } from 'app/utils/formikUtils';

interface FormikValidationErrorSummaryProps {
    className?: string;
}

type Props = FormikValidationErrorSummaryProps & ConnectedFormikProps<AppFormField> & InjectedIntlProps;

const FormikValidationErrorSummary: React.FunctionComponent<Props> = ({
    formik: { errors, status, submitCount, ...otherFormik },
    intl,
    className
}) => {
    if (errors) {
        const numberOfErrors = Object.keys(errors).length;
        const errorMessages: ValidationSummaryError[] = [];

        if (numberOfErrors > 0 && showValidationErrors(status, submitCount)) {
            const allErrors = flattenFieldArrayErrors(errors);
            Object.keys(allErrors).forEach((key) => {
                const error = allErrors[key];
                const message = isFieldValidationError(error) ? renderFieldValidationError(intl, error) : error;
                if (message && typeof message === 'string') {
                    errorMessages.push({
                        name: key,
                        message
                    });
                }
            });

            if (errorMessages.length === 0) {
                return null;
            }
            return (
                <ValidationErrorSummaryBase
                    className={className}
                    errors={errorMessages}
                    title={intlHelper(intl, 'formikValidationErrorSummary.tittel')}
                />
            );
        }
    }

    return null;
};

export default connect<FormikValidationErrorSummaryProps, AppFormField>(injectIntl(FormikValidationErrorSummary));
