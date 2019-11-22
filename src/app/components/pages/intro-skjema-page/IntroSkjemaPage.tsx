import * as React from 'react';
import { YesOrNo } from '../../../../common/types/YesOrNo';
import Page from '../../../../common/components/page/Page';
import { default as YesOrNoQuestion } from '../../../../common/form-components/yes-or-no-question-base/YesOrNoQuestionBase';
import CounsellorPanel from '../../../../common/components/counsellor-panel/CounsellorPanel';
import bemUtils from '../../../../common/utils/bemUtils';
import Box from '../../../../common/components/box/Box';
import StepBanner from '../../step-banner/StepBanner';
import InformationPoster from '../../../../common/components/information-poster/InformationPoster';
import { FormattedMessage, InjectedIntlProps, injectIntl, FormattedHTMLMessage } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import RouteConfig from '../../../config/routeConfig';

const bem = bemUtils('introPage');

const IntroSkjemaPage: React.StatelessComponent<InjectedIntlProps> = ({ intl }) => {
    const [kroniskEllerFunksjonshemmende, setKroniskEllerFunksjonshemmende] = React.useState(YesOrNo.UNANSWERED);

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introSkjemaPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introSkjemaPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <FormattedMessage id={`introSkjemaPage.tekst`} />
                </InformationPoster>
            </Box>
            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'introSkjemaPage.spm.kroniskEllerFunksjonshemmende')}
                    name="kroniskEllerFunksjonshemmende"
                    checked={kroniskEllerFunksjonshemmende}
                    onChange={(value) => setKroniskEllerFunksjonshemmende(value)}
                />
            </Box>
            <Box margin="xl" textAlignCenter={true}>
                {kroniskEllerFunksjonshemmende === YesOrNo.NO && (
                    <CounsellorPanel>
                        <FormattedHTMLMessage id={`introSkjemaPage.infoIkkeKroniskEllerFunksjonshemmende`} />
                    </CounsellorPanel>
                )}
                {kroniskEllerFunksjonshemmende === YesOrNo.YES && (
                    <Lenke href={RouteConfig.WELCOMING_PAGE_ROUTE}>
                        <FormattedMessage id="gotoApplicationLink.lenketekst" />
                    </Lenke>
                )}
            </Box>
        </Page>
    );
};

export default injectIntl(IntroSkjemaPage);
