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
import getLenker from '../../../lenker';

const bem = bemUtils('introPage');

const IntroPage: React.StatelessComponent<InjectedIntlProps> = ({ intl }) => {
    const [kroniskEllerFunksjonshemmende, setKroniskEllerFunksjonshemmende] = React.useState(YesOrNo.UNANSWERED);

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <FormattedHTMLMessage id={`introPage.arbeidssituasjon.html`} />
                </InformationPoster>
            </Box>
            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'introPage.spm.kroniskEllerFunksjonshemmende')}
                    name="kroniskEllerFunksjonshemmende"
                    checked={kroniskEllerFunksjonshemmende}
                    onChange={(value) => setKroniskEllerFunksjonshemmende(value)}
                />
            </Box>
            <Box margin="xl" textAlignCenter={true}>
                {kroniskEllerFunksjonshemmende === YesOrNo.NO && (
                    <CounsellorPanel>
                        <FormattedHTMLMessage
                            id={`introPage.infoIkkeKroniskEllerFunksjonshemmende.html`}
                            values={{ url: getLenker(intl.locale).papirskjemaPrivat }}
                        />
                    </CounsellorPanel>
                )}
                {kroniskEllerFunksjonshemmende === YesOrNo.YES && (
                    <>
                        <Box padBottom="xxl">
                            <CounsellorPanel>
                                <FormattedHTMLMessage id={`introPage.legeerklæring.html`} />
                            </CounsellorPanel>
                        </Box>
                        <Lenke href={RouteConfig.WELCOMING_PAGE_ROUTE}>
                            <FormattedMessage id="gotoApplicationLink.lenketekst" />
                        </Lenke>
                    </>
                )}
            </Box>
        </Page>
    );
};

export default injectIntl(IntroPage);
