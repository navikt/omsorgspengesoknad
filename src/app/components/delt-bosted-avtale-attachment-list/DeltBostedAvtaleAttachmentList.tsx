import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from '@navikt/sif-common-core/lib/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from '@navikt/sif-common-core/lib/components/attachment-list/AttachmentList';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    containsAnyUploadedAttachments,
    fileExtensionIsValid,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { removeElementFromArray } from '@navikt/sif-common-core/lib/utils/listUtils';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import api from '../../api/api';

interface Props {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const DeltBostedAvtaleAttachmentList: React.FunctionComponent<Props> = ({
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality,
}) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const avtale: Attachment[] = values.samværsavtale.filter(({ file }: Attachment) => fileExtensionIsValid(file.name));

    if (!containsAnyUploadedAttachments(avtale)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenBostedsavtaleLastetOpp" />
            </Normaltekst>
        );
        if (wrapNoAttachmentsInBox) {
            return <Box margin="m">{noAttachmentsText}</Box>;
        }
        return noAttachmentsText;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={avtale}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(SoknadFormField.samværsavtale, avtale);
                    if (attachment.url) {
                        api.deleteFile(attachment.url).then(
                            () => {
                                setFieldValue(
                                    SoknadFormField.samværsavtale,
                                    removeElementFromArray(attachment, avtale)
                                );
                            },
                            () => {
                                setFieldValue(
                                    SoknadFormField.samværsavtale,
                                    removeElementFromArray(attachment, avtale)
                                );
                            }
                        );
                    }
                }}
            />
        );
    } else {
        return <AttachmentList attachments={avtale} />;
    }
};

export default DeltBostedAvtaleAttachmentList;
