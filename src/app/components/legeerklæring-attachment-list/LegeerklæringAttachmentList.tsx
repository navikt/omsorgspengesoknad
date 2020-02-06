import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import Box from 'common/components/box/Box';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import { connect } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { deleteFile } from '../../api/api';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';





interface LegeerklæringAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps & ConnectedFormikProps<AppFormField>;

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    formik: { values, setFieldValue },
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const legeerklæring: Attachment[] = values[AppFormField.legeerklæring].filter(({ file }: Attachment) =>
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
                    deleteFile(attachment.url!).then(
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
                }}
            />
        );
    } else {
        return <AttachmentList attachments={legeerklæring} />;
    }
};

export default connect<LegeerklæringAttachmentListProps, AppFormField>(LegeerklæringAttachmentList);
