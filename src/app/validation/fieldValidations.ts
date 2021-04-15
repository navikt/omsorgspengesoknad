import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';

export enum ValidateAlleDokumenterISøknadeErrors {
    'samletStørrelseForHøy' = 'samletStørrelseForHøy',
    'forMangeFiler' = 'forMangeFiler',
}
export const validateAlleDokumenterISøknaden = (
    attachments: Attachment[]
): ValidationResult<ValidateAlleDokumenterISøknadeErrors> => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    const totalSizeInBytes: number = getTotalSizeOfAttachments(uploadedAttachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return ValidateAlleDokumenterISøknadeErrors.samletStørrelseForHøy;
    }
    if (uploadedAttachments.length > 100) {
        return ValidateAlleDokumenterISøknadeErrors.forMangeFiler;
    }
    return undefined;
};
