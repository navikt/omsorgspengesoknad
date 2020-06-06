import * as React from 'react';
import { useIntl } from 'react-intl';
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
                <p>Ta bilde av avtalen om delt bosted og last opp.</p>Vær nøye med:
                <ul>
                    <li>å få all tekst med på bildet</li>
                    <li>at signaturen fra begge parter er synlig på bildet</li>
                    <li>at bildet er leselig</li>
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
