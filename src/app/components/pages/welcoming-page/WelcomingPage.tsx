import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Sidetittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrontPageBanner from '@navikt/sif-common-core/lib/components/front-page-banner/FrontPageBanner';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps } from '../../../config/stepConfig';
import BehandlingAvPersonopplysningerModal from '../../behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import DinePlikterModal from '../../dine-plikter-modal/DinePlikterModal';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';
import { useLogSidevisning } from '@navikt/sif-common-amplitude/lib';

const bem = bemHelper('welcomingPage');

type Props = Omit<StepConfigProps, 'formValues'> & WrappedComponentProps;

const WelcomingPage = (props: Props) => {
    const [dinePlikterModalOpen, setDinePlikterModalOpen] = React.useState(false);
    const [behandlingAvPersonopplysningerModalOpen, setBehandlingAvPersonopplysningerModalOpen] = React.useState(false);
    const { onValidSubmit, intl } = props;

    useLogSidevisning('velkommen');

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
