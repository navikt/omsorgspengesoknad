import * as React from 'react';
import { connect } from 'formik';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';
import AttachmentList from '../../../common/components/attachment-list/AttachmentList';
import { removeElementFromArray } from '../../../common/utils/listUtils';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { deleteFile } from '../../api/api';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from '../../../common/utils/attachmentUtils';
import Box from '../../../common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from '../../../common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import { FormattedMessage } from 'react-intl';
import { Attachment } from '../../../common/types/Attachment';

interface SamværsavtaleAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = SamværsavtaleAttachmentListProps & ConnectedFormikProps<AppFormField>;

const SamværsavtaleAttachmentList: React.FunctionComponent<Props> = ({
    formik: { values, setFieldValue },
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const avtale: Attachment[] = values[AppFormField.samværsavtale].filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(avtale)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenSamværsavtaleLastetOpp" />
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
                    setFieldValue(AppFormField.samværsavtale, avtale);
                    deleteFile(attachment.url!).then(
                        () => {
                            setFieldValue(AppFormField.samværsavtale, removeElementFromArray(attachment, avtale));
                        },
                        () => {
                            setFieldValue(AppFormField.samværsavtale, removeElementFromArray(attachment, avtale));
                        }
                    );
                }}
            />
        );
    } else {
        return <AttachmentList attachments={avtale} />;
    }
};

export default connect<SamværsavtaleAttachmentListProps, AppFormField>(SamværsavtaleAttachmentList);
