import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import bemHelper from '../../../common/utils/bemUtils';
import './stepBanner.less';
import Banner from '@navikt/dusseldorf-frontend-common/lib/common/components/banner/Banner';

interface StepBannerProps {
    text: string;
}

const bem = bemHelper('stepBanner');
const StepBanner: React.FunctionComponent<StepBannerProps> = ({ text }) => (
    <Banner size="small" className={bem.block}>
        <Undertittel tag="h2">{text}</Undertittel>
    </Banner>
);

export default StepBanner;
