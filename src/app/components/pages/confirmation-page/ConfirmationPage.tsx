import * as React from 'react';
import Page from '../../../../common/components/page/Page';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from '../../../../common/components/box/Box';
import bemUtils from '../../../../common/utils/bemUtils';
import CheckmarkIcon from '../../../../common/components/checkmark-icon/CheckmarkIcon';
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import getLenker from 'app/lenker';
import './confirmationPage.less';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import AlertStripe from 'nav-frontend-alertstriper';

const bem = bemUtils('confirmationPage');

const ConfirmationPage: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
            <div className={bem.element('centeredContent')}>
                <CheckmarkIcon />
                <Box margin="xl">
                    <Innholdstittel>
                        <FormattedMessage id="page.confirmation.tittel" />
                    </Innholdstittel>
                </Box>
            </div>
            <Box margin="xl">
                <Ingress>
                    <FormattedMessage id="page.confirmation.undertittel" />
                </Ingress>
                <ul className="checklist">
                    <li>
                        <FormattedHTMLMessage id="page.confirmation.hvaSkjer1" />
                    </li>
                    <li>
                        <FormattedHTMLMessage id="page.confirmation.hvaSkjer2" />
                    </li>
                    <li>
                        <FormattedHTMLMessage
                            id="page.confirmation.hvaSkjer3"
                            values={{
                                lenke: getLenker(intl.locale).saksbehandlingstider
                            }}
                        />
                    </li>
                </ul>
            </Box>
            {appIsRunningInDemoMode() && 1 + 1 === 3 && (
                <Box margin="xxl">
                    <AlertStripe type="info">
                        <p>
                            Hvis du har flere innspill til oss om hvordan vi kan gjøre søknaden bedre, kan du skrive til
                            oss <a href="https://surveys.hotjar.com/s?siteId=148751&surveyId=144184">på denne siden</a>.
                        </p>
                        <p>Tusen takk for hjelpen!</p>
                    </AlertStripe>
                </Box>
            )}
        </Page>
    );
};

export default ConfirmationPage;
