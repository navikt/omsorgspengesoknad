import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import FormBlock from 'common/components/form-block/FormBlock';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { enableDemoModeUpload } from '../../../utils/envUtils';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateSamværsavtale } from '../../../validation/fieldValidations';
import FileUploadErrors from '../../file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import SamværsavtaleAttachmentList from '../../samværsavtale-attachment-list/SamværsavtaleAttachmentList';

const SamværsavtaleStep = ({ onValidSubmit }: StepConfigProps) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();
    // KORONA; const isRunningDemoMode = appIsRunningInDemoMode();
    const showUploadForm = enableDemoModeUpload() === false;

    return (
        <FormikStep
            id={StepID.SAMVÆRSAVTALE}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={false}
            skipValidation={true}> // KORONA
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
                    <FormBlock>
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
                    </FormBlock>
                    <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                    <SamværsavtaleAttachmentList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
                </>
            )}
        </FormikStep>
    );
};

export default SamværsavtaleStep;
