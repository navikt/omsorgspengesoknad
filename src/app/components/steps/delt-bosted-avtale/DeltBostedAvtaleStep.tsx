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
import validateAll from '@navikt/sif-common-formik/lib/validation/utils/validateAll';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import {
    validateAlleDokumenterISøknaden,
    ValidateAlleDokumenterISøknadeErrors,
} from '../../../validation/fieldValidations';
import DeltBostedAvtaleAttachmentList from '../../delt-bosted-avtale-attachment-list/DeltBostedAvtaleAttachmentList';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import { validateList, ValidateListErrors } from '@navikt/sif-common-formik/lib/validation';

const DeltBostedAvtaleStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();
    const { values } = useFormikContext<OmsorgspengesøknadFormData>();
    const otherAttachmentsInSøknad = values.legeerklæring;
    const samværsavtaleAttachments = values.samværsavtale ? values.samværsavtale : [];
    const totalSize = getTotalSizeOfAttachments([...samværsavtaleAttachments, ...otherAttachmentsInSøknad]);
    const totalSizeOfAttachmentsOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;
    const hasPendingUploads: boolean = (values.samværsavtale || []).find((a: any) => a.pending === true) !== undefined;

    return (
        <FormikStep
            id={StepID.DELT_BOSTED}
            onValidFormSubmit={onValidSubmit}
            useValidationErrorSummary={false}
            skipValidation={true}
            buttonDisabled={hasPendingUploads || totalSizeOfAttachmentsOver24Mb}>
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
                        name={AppFormField.samværsavtale}
                        label={intlHelper(intl, 'steg.samværsavtale.vedlegg')}
                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        validate={(attachments) => {
                            const error = validateAll([
                                () => validateAlleDokumenterISøknaden(otherAttachmentsInSøknad),
                                () => validateList({ required: true })(attachments),
                            ]);
                            switch (error) {
                                case ValidateListErrors.isEmpty:
                                    return intlHelper(intl, 'validation.samværsavtale.mangler');
                                case ValidateAlleDokumenterISøknadeErrors.forMangeFiler:
                                    return intlHelper(intl, 'validation.alleDokumenter.forMangeFiler');
                                case ValidateAlleDokumenterISøknadeErrors.samletStørrelseForHøy:
                                    return intlHelper(intl, 'validation.alleDokumenter.samletStørrelseForHøy');
                            }
                            return undefined;
                        }}
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
