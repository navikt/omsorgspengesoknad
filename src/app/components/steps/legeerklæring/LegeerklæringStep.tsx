import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-attachment-list/LegeerklæringAttachmentList';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import Lenke from 'nav-frontend-lenker';
import { getTotalSizeOfAttachments, MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from 'common/utils/attachmentUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { useFormikContext } from 'formik';

const LegeerklæringStep = ({ onValidSubmit, formValues }: StepConfigProps) => {
    const intl = useIntl();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean = (formValues.legeerklæring || []).find((a) => a.pending === true) !== undefined;
    const { values } = useFormikContext<OmsorgspengesøknadFormData>();
    const totalSize = getTotalSizeOfAttachments(values.legeerklæring);

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={false}
            skipValidation={true}
            buttonDisabled={hasPendingUploads}>
            <Box padBottom="xl">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id={'step.legeerklaering.counsellorpanel.1'} />
                        <Lenke
                            href="https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-06.05/ettersendelse"
                            target="_blank">
                            <FormattedMessage id={'step.legeerklaering.counsellorpanel.2'} />
                        </Lenke>
                        .
                    </p>
                </CounsellorPanel>
            </Box>
            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>
            <Box margin="l">
                <FormikFileUploader
                    name={AppFormField.legeerklæring}
                    label={intlHelper(intl, 'steg.lege.vedlegg')}
                    onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                    onFileInputClick={() => {
                        setFilesThatDidntGetUploaded([]);
                    }}
                    validate={validateLegeerklæring}
                    onUnauthorizedOrForbiddenUpload={navigateToLoginPage}
                />
            </Box>
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'steg.dokumenter.advarsel.totalstørrelse'} />
                    </AlertStripeAdvarsel>
                </Box>
            )}
            {filesThatDidntGetUploaded && filesThatDidntGetUploaded.length > 0 && (
                <Box margin="m">
                    <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                </Box>
            )}
            <LegeerklæringFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
        </FormikStep>
    );
};

export default LegeerklæringStep;
