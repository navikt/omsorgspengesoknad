import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from '@navikt/sif-common-core/lib/components/file-upload-errors/FileUploadErrors';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import { validateAttachments, ValidateAttachmentsErrors } from '../../validation/fieldValidations';
import DeltBostedAvtaleAttachmentList from '../../components/delt-bosted-avtale-attachment-list/DeltBostedAvtaleAttachmentList';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { getUploadedAttachments } from '../../utils/attachmentUtils';
import { StepID } from '../soknadStepsConfig';
import SoknadFormStep from '../SoknadFormStep';
import { relocateToLoginPage } from '../../utils/navigationUtils';

interface Props {
    formData: SoknadFormData;
}

const DeltBostedAvtaleStep = ({ formData }: Props) => {
    const intl = useIntl();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);

    const hasPendingUploads: boolean =
        (formData.samværsavtale || []).find((a: any) => a.pending === true) !== undefined;
    const otherAttachmentsInSøknad = formData.legeerklæring;
    const samværsavtaleAttachments = formData.samværsavtale ? formData.samværsavtale : [];
    const totalSize = getTotalSizeOfAttachments([...samværsavtaleAttachments, ...otherAttachmentsInSøknad]);
    const totalSizeOfAttachmentsOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep id={StepID.DELT_BOSTED} buttonDisabled={hasPendingUploads || totalSizeOfAttachmentsOver24Mb}>
            <Box padBottom="xl">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id={'step.deltBosted.helperTextPanel.1'} />
                    </p>
                    <p>
                        <FormattedMessage id={'step.deltBosted.helperTextPanel.2'} />
                    </p>
                </CounsellorPanel>
            </Box>
            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>

            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <FormBlock>
                    <FormikFileUploader
                        name={SoknadFormField.samværsavtale}
                        label={intlHelper(intl, 'steg.samværsavtale.vedlegg')}
                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        validate={(attachments) => {
                            return validateAll<ValidateAttachmentsErrors | ValidationError>([
                                () => validateAttachments([...attachments, ...otherAttachmentsInSøknad]),
                                () => getListValidator({ required: true })(getUploadedAttachments(attachments)),
                            ]);
                        }}
                        onUnauthorizedOrForbiddenUpload={relocateToLoginPage}
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
        </SoknadFormStep>
    );
};

export default DeltBostedAvtaleStep;
