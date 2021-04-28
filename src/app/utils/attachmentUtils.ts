import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { attachmentHasBeenUploaded } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { AppFormField, OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';

export const valuesToAlleDokumenterISøknaden = (values: OmsorgspengesøknadFormData): Attachment[] => {
    const samværsavtaleDokumenter: Attachment[] = values.samværsavtale ? values.samværsavtale : [];
    return [...values[AppFormField.legeerklæring], ...samværsavtaleDokumenter];
};

export const getUploadedAttachments = (attachments: Attachment[]): Attachment[] =>
    attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
