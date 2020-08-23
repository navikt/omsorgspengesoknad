import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from 'common/components/form-block/FormBlock';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateDeltBostedAvtale } from '../../../validation/fieldValidations';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import DeltBostedAvtaleAttachmentList from '../../delt-bosted-avtale-attachment-list/DeltBostedAvtaleAttachmentList';
import Box from 'common/components/box/Box';

const DeltBostedAvtaleStep = ({ onValidSubmit }: StepConfigProps) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();

    return (
        <FormikStep
            id={StepID.DELT_BOSTED}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={false}
            skipValidation={true}>
            <HelperTextPanel>
                <Box margin={'l'} padBottom={'l'}>
                    <FormattedMessage id={'step.deltBosted.helperTextPanel.1'} />
                </Box>
                <Box>
                    <FormattedMessage id={'step.deltBosted.helperTextPanel.2'} />
                </Box>
                <ul>
                    <li>
                        <FormattedMessage id={'step.deltBosted.helperTextPanel.3.1'} />
                    </li>
                    <li>
                        <FormattedMessage id={'step.deltBosted.helperTextPanel.3.2'} />
                    </li>
                    <li>
                        <FormattedMessage id={'step.deltBosted.helperTextPanel.3.3'} />
                    </li>
                </ul>
            </HelperTextPanel>
            <FormBlock>
                <FormikFileUploader
                    name={AppFormField.samværsavtale}
                    label={intlHelper(intl, 'steg.samværsavtale.vedlegg')}
                    onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                    onFileInputClick={() => {
                        setFilesThatDidntGetUploaded([]);
                    }}
                    validate={validateDeltBostedAvtale}
                    onUnauthorizedOrForbiddenUpload={navigateToLoginPage}
                />
            </FormBlock>
            <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            <DeltBostedAvtaleAttachmentList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
        </FormikStep>
    );
};

export default DeltBostedAvtaleStep;
