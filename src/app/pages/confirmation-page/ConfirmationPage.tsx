import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CheckmarkIcon from '@navikt/sif-common-core/lib/components/checkmark-icon/CheckmarkIcon';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import getLenker from '../../lenker';
import './confirmationPage.less';

const bem = bemUtils('confirmationPage');

const ConfirmationPage: React.FunctionComponent = () => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.kvittering);

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
                        </Lenke>
                    </li>
                </ul>
            </Box>
        </Page>
    );
};

export default ConfirmationPage;
