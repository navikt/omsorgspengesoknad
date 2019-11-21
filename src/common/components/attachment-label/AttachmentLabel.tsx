import * as React from 'react';
import Lenke from 'nav-frontend-lenker';
import CustomSVG from '../../../app/components/custom-svg/CustomSVG';
import bemHelper from '../../../app/utils/bemUtils';
const attachmentIcon = require('./assets/attachment.svg').default;
import ContentSwitcher from '../../../app/components/content-switcher/ContentSwitcher';
import './attachmentLabel.less';

interface AttachmentLabelProps {
    attachment: Attachment;
}

const attachmentLabelBem = bemHelper('attachmentLabel');

const AttachmentLabel: React.FunctionComponent<AttachmentLabelProps> = ({ attachment: { url, file } }) => (
    <span>
        <CustomSVG iconRef={attachmentIcon} size={20} />
        <ContentSwitcher
            firstContent={() => <div className={attachmentLabelBem.element('text')}>{file.name}</div>}
            secondContent={() => (
                <Lenke className={attachmentLabelBem.element('text')} href={url!} target="_blank">
                    {file.name}
                </Lenke>
            )}
            showFirstContent={url === undefined}
        />
    </span>
);

export default AttachmentLabel;
