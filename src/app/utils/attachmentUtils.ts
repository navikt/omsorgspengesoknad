import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { attachmentHasBeenUploaded } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { SoknadFormField, SoknadFormData } from '../types/SoknadFormData';

export const valuesToAlleDokumenterISøknaden = (values: SoknadFormData): Attachment[] => {
    const samværsavtaleDokumenter: Attachment[] = values.samværsavtale ? values.samværsavtale : [];
    return [...values[SoknadFormField.legeerklæring], ...samværsavtaleDokumenter];
};

export const getUploadedAttachments = (attachments: Attachment[]): Attachment[] =>
    attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
