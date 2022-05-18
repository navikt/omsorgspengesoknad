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
import { deleteFile } from '../../api/api';
import { AppFormField, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';

interface Props {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality,
}) => {
    const { values, setFieldValue } = useFormikContext<OmsorgspengesøknadFormData>();

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
                    setFieldValue(AppFormField.legeerklæring, legeerklæring);
                    if (attachment.url) {
                        deleteFile(attachment.url).then(
                            () => {
                                setFieldValue(
                                    AppFormField.legeerklæring,
                                    removeElementFromArray(attachment, legeerklæring)
                                );
                            },
                            () => {
                                setFieldValue(
                                    AppFormField.legeerklæring,
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
