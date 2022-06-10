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

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality,
}) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const legeerklæring: Attachment[] = values.legeerklæring.filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(legeerklæring)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenLegeerklæringLastetOpp" />
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
                attachments={legeerklæring}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(SoknadFormField.legeerklæring, legeerklæring);
                    if (attachment.url) {
                        api.deleteFile(attachment.url).then(
                            () => {
                                setFieldValue(
                                    SoknadFormField.legeerklæring,
                                    removeElementFromArray(attachment, legeerklæring)
                                );
                            },
                            () => {
                                setFieldValue(
                                    SoknadFormField.legeerklæring,
                                    removeElementFromArray(attachment, legeerklæring)
                                );
                            }
                        );
                    }
                }}
            />
        );
    } else {
        return <AttachmentList attachments={legeerklæring} />;
    }
};

export default LegeerklæringAttachmentList;
