import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { validateAttachments, ValidateAttachmentsErrors } from '../fieldValidations';

describe('validateAttachments', () => {
    const fileMock = new File([''], 'filename.png', { type: 'text/png' });

    const largeFileSize = MAX_TOTAL_ATTACHMENT_SIZE_BYTES / 2 + 1;
    const uploadedAttachment: Attachment = { file: fileMock, pending: false, uploaded: true };
    const largeAttachment: Attachment = {
        file: { ...fileMock, size: largeFileSize, name: 'filename.png' },
        pending: false,
        uploaded: true,
    };

    const maxItems: Attachment[] = [];
    for (let i = 0; i < 100; i++) {
        maxItems.push(uploadedAttachment);
    }

    it(`should return undefined if list contains 100 or less`, () => {
        expect(validateAttachments(maxItems)).toBeUndefined();
    });

    it(`should return ${ValidateAttachmentsErrors.forMangeFiler} if list contains more than 100 attachements`, () => {
        expect(validateAttachments([...maxItems, uploadedAttachment])).toBe(ValidateAttachmentsErrors.forMangeFiler);
    });
    it(`should return ${ValidateAttachmentsErrors.samletStørrelseForHøy} if attachments too large`, () => {
        expect(validateAttachments([largeAttachment, largeAttachment])).toBe(
            ValidateAttachmentsErrors.samletStørrelseForHøy
        );
    });
});
