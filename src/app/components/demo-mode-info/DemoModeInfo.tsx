import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import './demoModeInfo.less';



const DemoModeInfo: React.FunctionComponent<{}> = () => (
    <div className="demoModeInfoWrapper">
        <AlertStripeAdvarsel>
            <FormattedHTMLMessage id="demoInfo.html" />
        </AlertStripeAdvarsel>
    </div>
);

export default DemoModeInfo;
