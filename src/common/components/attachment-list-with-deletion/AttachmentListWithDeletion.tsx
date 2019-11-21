import * as React from 'react';
import UnstyledList from '../unstyled-list/UnstyledList';
import AttachmentListElement from '../attachment-list-element/AttachmentListElement';
import DeleteButton from '../../../app/components/delete-button/DeleteButton';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import ContentSwitcher from '../../../app/components/content-switcher/ContentSwitcher';
import intlHelper from 'app/utils/intlUtils';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

interface AttachmentListWithDeletionProps {
    attachments: Attachment[];
    onRemoveAttachmentClick: (attachment: Attachment, e: React.SyntheticEvent) => void;
}

const AttachmentListWithDeletion: React.FunctionComponent<AttachmentListWithDeletionProps & InjectedIntlProps> = ({
    intl,
    attachments,
    onRemoveAttachmentClick
}) => (
    <UnstyledList>
        {attachments
            .filter(({ pending, uploaded }) => uploaded || pending)
            .map((attachment, index) => (
                <AttachmentListElement
                    attachment={attachment}
                    key={attachment.file.name + index}
                    renderRightAlignedContent={() => (
                        <ContentSwitcher
                            showFirstContent={attachment.pending}
                            firstContent={() => <LoadingSpinner type="XS" />}
                            noSpan={true}
                            secondContent={() => (
                                <DeleteButton
                                    ariaLabel={intlHelper(intl, 'vedleggsliste.fjernKnapp')}
                                    onClick={(e) => onRemoveAttachmentClick(attachment, e)}>
                                    <FormattedMessage id="vedleggsliste.fjernKnapp" />
                                </DeleteButton>
                            )}
                        />
                    )}
                />
            ))}
    </UnstyledList>
);

export default injectIntl(AttachmentListWithDeletion);
