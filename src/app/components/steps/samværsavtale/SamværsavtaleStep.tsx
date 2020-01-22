import * as React from 'react';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import FileUploadErrors from '../../file-upload-errors/FileUploadErrors';
import { validateSamværsavtale } from '../../../validation/fieldValidations';
import HelperTextPanel from '../../../../common/components/helper-text-panel/HelperTextPanel';
import Box from '../../../../common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { appIsRunningInDemoMode, enableDemoModeUpload } from '../../../utils/envUtils';
import { CustomFormikProps } from '../../../types/FormikProps';
import SamværsavtaleAttachmentList from '../../samværsavtale-attachment-list/SamværsavtaleAttachmentList';

type Props = { formikProps: CustomFormikProps } & CommonStepFormikProps & HistoryProps & StepConfigProps;

const SamværsavtaleStep = ({ history, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();

    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const isRunningDemoMode = appIsRunningInDemoMode();
    const showUploadForm = enableDemoModeUpload() === false;

    return (
        <FormikStep
            id={StepID.SAMVÆRSAVTALE}
            onValidFormSubmit={navigate}
            history={history}
            useValidationErrorSummary={false}
            skipValidation={isRunningDemoMode}
            {...stepProps}>
            {!showUploadForm && (
                <Box>
                    <AlertStripeInfo>
                        Opplasting av samværsavtalen er ikke tilgjengelig i demo versjon. Du kan klikke Fortsett.
                    </AlertStripeInfo>
                </Box>
            )}
            {showUploadForm && (
                <>
                    <HelperTextPanel>
                        <FormattedHTMLMessage id="steg.samværsavtale.info.html" />
                    </HelperTextPanel>
                    <Box margin="l">
                        <FormikFileUploader
                            name={AppFormField.samværsavtale}
                            label={intlHelper(intl, 'steg.samværsavtale.vedlegg')}
                            onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                            onFileInputClick={() => {
                                setFilesThatDidntGetUploaded([]);
                            }}
                            validate={validateSamværsavtale}
                            onUnauthorizedOrForbiddenUpload={navigateToLoginPage}
                        />
                    </Box>
                    <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                    <SamværsavtaleAttachmentList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
                </>
            )}
        </FormikStep>
    );
};

export default SamværsavtaleStep;
