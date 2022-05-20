import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from '@navikt/sif-common-core/lib/components/file-upload-errors/FileUploadErrors';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import { validateAttachments } from '../../validation/fieldValidations';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import LegeerklæringFileList from '../../components/legeerklæring-attachment-list/LegeerklæringAttachmentList';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { relocateToLoginPage } from '../../utils/navigationUtils';

interface Props {
    formData: SoknadFormData;
}

const LegeerklæringStep = ({ formData }: Props) => {
    const intl = useIntl();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean = (formData.legeerklæring || []).find((a) => a.pending === true) !== undefined;

    const alleDokumenterISøknaden = valuesToAlleDokumenterISøknaden(formData);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const totalSizeOfAttachmentsOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep id={StepID.LEGEERKLÆRING} buttonDisabled={hasPendingUploads || totalSizeOfAttachmentsOver24Mb}>
            <Box padBottom="xl">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id={'step.legeerklaering.counsellorpanel.1'} />
                    </p>
                    <p>
                        <FormattedMessage id={'step.legeerklaering.counsellorpanel.2'} />{' '}
                        <Lenke
                            href="https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-06.05/ettersendelse"
                            target="_blank">
                            <FormattedMessage id={'step.legeerklaering.counsellorpanel.ettersendLenke'} />
                        </Lenke>
                    </p>
                </CounsellorPanel>
            </Box>
            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin="l">
                    <FormikFileUploader
                        name={SoknadFormField.legeerklæring}
                        label={intlHelper(intl, 'steg.lege.vedlegg')}
                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        validate={() => {
                            return validateAttachments(alleDokumenterISøknaden);
                        }}
                        onUnauthorizedOrForbiddenUpload={relocateToLoginPage}
                    />
                </Box>
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
            {filesThatDidntGetUploaded && filesThatDidntGetUploaded.length > 0 && (
                <Box margin="m">
                    <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                </Box>
            )}
            <LegeerklæringFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
        </SoknadFormStep>
    );
};

export default LegeerklæringStep;
