import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { MAX_TOTAL_ATTACHMENT_SIZE_BYTES } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { validateAlleDokumenterISøknaden, ValidateAlleDokumenterISøknadeErrors } from '../fieldValidations';

describe('validateAlleDokumenterISøknaden', () => {
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
        expect(validateAlleDokumenterISøknaden(maxItems)).toBeUndefined();
    });

    it(`should return ${ValidateAlleDokumenterISøknadeErrors.forMangeFiler} if list contains more than 100 attachements`, () => {
        expect(validateAlleDokumenterISøknaden([...maxItems, uploadedAttachment])).toBe(
            ValidateAlleDokumenterISøknadeErrors.forMangeFiler
        );
    });
    it(`should return ${ValidateAlleDokumenterISøknadeErrors.samletStørrelseForHøy} if attachments too large`, () => {
        expect(validateAlleDokumenterISøknaden([largeAttachment, largeAttachment])).toBe(
            ValidateAlleDokumenterISøknadeErrors.samletStørrelseForHøy
        );
    });
});
