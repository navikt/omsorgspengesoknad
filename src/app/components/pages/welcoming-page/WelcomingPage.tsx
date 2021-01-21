import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrontPageBanner from '@navikt/sif-common-core/lib/components/front-page-banner/FrontPageBanner';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Sidetittel } from 'nav-frontend-typografi';
import { StepConfigProps } from '../../../config/stepConfig';
import BehandlingAvPersonopplysningerModal from '../../behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import DinePlikterModal from '../../dine-plikter-modal/DinePlikterModal';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

type Props = Omit<StepConfigProps, 'formValues'> & WrappedComponentProps;

const WelcomingPage: React.FunctionComponent<Props> = (props) => {
    const [dinePlikterModalOpen, setDinePlikterModalOpen] = React.useState(false);
    const [behandlingAvPersonopplysningerModalOpen, setBehandlingAvPersonopplysningerModalOpen] = React.useState(false);
    const { onValidSubmit, intl } = props;

    useLogSidevisning(SIFCommonPageKey.velkommen);

    return (
        <>
            <Page
                title={intlHelper(intl, 'welcomingPage.sidetittel')}
                className={bem.block}
                topContentRenderer={() => (
                    <FrontPageBanner
                        bannerSize="large"
                        counsellorWithSpeechBubbleProps={{
                            strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                            normalText: intlHelper(intl, 'welcomingPage.banner.tekst'),
                        }}
                    />
                )}>
                <Box margin="xxl">
                    <Sidetittel className={bem.element('title')}>
                        <FormattedMessage id="welcomingPage.introtittel" />
                    </Sidetittel>
                </Box>
                <SamtykkeForm
                    onOpenDinePlikterModal={() => setDinePlikterModalOpen(true)}
                    openBehandlingAvPersonopplysningerModal={() => setBehandlingAvPersonopplysningerModalOpen(true)}
                    onConfirm={onValidSubmit}
                />
            </Page>

            <DinePlikterModal
                isOpen={dinePlikterModalOpen}
                onRequestClose={() => setDinePlikterModalOpen(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
            />
            <BehandlingAvPersonopplysningerModal
                isOpen={behandlingAvPersonopplysningerModalOpen}
                onRequestClose={() => setBehandlingAvPersonopplysningerModalOpen(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}
            />
        </>
    );
};

export default injectIntl(WelcomingPage);
