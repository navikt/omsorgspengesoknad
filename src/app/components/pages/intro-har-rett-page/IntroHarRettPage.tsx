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

const IntroHarRettPage: React.StatelessComponent<InjectedIntlProps> = ({ intl }) => {
    const [erYrkesaktiv, setErYrkesaktiv] = React.useState(YesOrNo.UNANSWERED);

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introHarRettPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introHarRettPage.stegTittel')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <FormattedMessage id={`introHarRettPage.tekst`} />
                </InformationPoster>
            </Box>
            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'introHarRettPage.yrkesaktiv.spm')}
                    name="erYrkesaktiv"
                    checked={erYrkesaktiv}
                    onChange={(value) => setErYrkesaktiv(value)}
                />
            </Box>
            <Box margin="xl" textAlignCenter={true}>
                {erYrkesaktiv === YesOrNo.NO && (
                    <CounsellorPanel>
                        <FormattedHTMLMessage id={`introHarRettPage.infoIkkeYrkesaktiv`} />
                    </CounsellorPanel>
                )}
                {erYrkesaktiv === YesOrNo.YES && <Lenke href={RouteConfig.SKJEMA}>Gå videre</Lenke>}
            </Box>
        </Page>
    );
};

export default injectIntl(IntroHarRettPage);
