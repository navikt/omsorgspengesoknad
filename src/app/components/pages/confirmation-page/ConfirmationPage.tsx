import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import getLenker from 'app/lenker';
import './confirmationPage.less';
import Lenke from 'nav-frontend-lenker';
import { useLogSidevisning } from '@navikt/sif-common-amplitude/lib';

const bem = bemUtils('confirmationPage');

const ConfirmationPage = () => {
    const intl = useIntl();
    useLogSidevisning('søknad-sendt');

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
                <Ingress tag="h2">
                    <FormattedMessage id="page.confirmation.info.tittel" />
                </Ingress>
                <ul className="checklist">
                    <li>
                        <FormattedMessage id="page.confirmation.info.1" />
                    </li>
                    <li>
                        <FormattedMessage id="page.confirmation.info.2" />
                    </li>
                    <li>
                        <FormattedMessage id="page.confirmation.info.3.1" />{' '}
                        <Lenke href={getLenker(intl.locale).saksbehandlingstider} target="_blank">
                            <FormattedMessage id="page.confirmation.info.3.2" />
                        </Lenke>{' '}
                        <FormattedMessage id="page.confirmation.info.3.3" />
                    </li>
                </ul>
            </Box>
        </Page>
    );
};

export default ConfirmationPage;
