import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from 'common/components/form-block/FormBlock';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import {
    validateDeltBostedAvtale,
    validateSumOfAllAttachmentsAndValidateStep
} from '../../../validation/fieldValidations';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import DeltBostedAvtaleAttachmentList from '../../delt-bosted-avtale-attachment-list/DeltBostedAvtaleAttachmentList';
import Box from 'common/components/box/Box';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import Lenke from 'nav-frontend-lenker';

const DeltBostedAvtaleStep = ({ onValidSubmit }: StepConfigProps) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();
    const { values } = useFormikContext<OmsorgspengesøknadFormData>();
    const otherAttachmentsInSøknad = values.legeerklæring;
    const samværsavtaleAttachments = values.samværsavtale ? values.samværsavtale : [];
    const totalSize = getTotalSizeOfAttachments([...samværsavtaleAttachments, ...otherAttachmentsInSøknad]);
    const totalSizeOfAttachmentsOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <FormikStep
            id={StepID.DELT_BOSTED}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={false}
            skipValidation={true}
            buttonDisabled={totalSizeOfAttachmentsOver24Mb}>
            <Box padBottom="xl">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id={'step.deltBosted.helperTextPanel.1'} />
                    </p>
                </CounsellorPanel>
            </Box>
            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <FormBlock>
                    <FormikFileUploader
                        name={AppFormField.samværsavtale}
                        label={intlHelper(intl, 'steg.samværsavtale.vedlegg')}
                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        validate={validateSumOfAllAttachmentsAndValidateStep(
                            otherAttachmentsInSøknad,
                            validateDeltBostedAvtale
                        )}
                        onUnauthorizedOrForbiddenUpload={navigateToLoginPage}
                    />
                </FormBlock>
            )}
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.1'} />
                        <Lenke
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            href={
                                'https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-35.01/ettersendelse'
                            }>
                            <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.2'} />
                        </Lenke>
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin={'l'}>
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <DeltBostedAvtaleAttachmentList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
        </FormikStep>
    );
};

export default DeltBostedAvtaleStep;
