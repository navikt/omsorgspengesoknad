import * as React from 'react';
import Banner, { BannerSize } from '../../../common/components/banner/Banner';
import bemHelper from '../../utils/bemUtils';
import CounsellorWithSpeechBubble, {
    CounsellorWithSpeechBubbleProps
} from '../../../common/components/counsellor-with-speech-bubble/CounsellorWithSpeechBubble';
import './frontPageBanner.less';

const bem = bemHelper('frontPageBanner');

interface FrontPageBannerProps {
    bannerSize: BannerSize;
    counsellorWithSpeechBubbleProps: CounsellorWithSpeechBubbleProps;
}

const FrontPageBanner: React.FunctionComponent<FrontPageBannerProps> = ({
    bannerSize,
    counsellorWithSpeechBubbleProps
}) => (
    <Banner size={bannerSize} className={bem.block}>
        <CounsellorWithSpeechBubble {...counsellorWithSpeechBubbleProps} />
    </Banner>
);

export default FrontPageBanner;
