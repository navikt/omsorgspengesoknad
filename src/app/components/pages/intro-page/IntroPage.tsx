import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import RouteConfig, { getRouteUrl } from '../../../config/routeConfig';
import CoronaWarning from '../../corona-warning/CoronaWarning';

const bem = bemUtils('introPage');

enum PageFormField {
    'harKroniskSyktBarn' = 'harKroniskSyktBarn'
}

interface PageFormValues {
    [PageFormField.harKroniskSyktBarn]: YesOrNo;
}

const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const IntroPage: React.StatelessComponent = () => {
    const intl = useIntl();
    const initialValues = {};
    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxl" padBottom="l">
                <CoronaWarning />
            </Box>
            <Box margin="xxxl" padBottom="xxl">
                <InformationPoster>
                    <FormattedHTMLMessage id={`introPage.intro.html`} />
                </InformationPoster>
            </Box>

            <PageForm.FormikWrapper
                onSubmit={() => null}
                initialValues={initialValues}
                renderForm={({ values }) => (
                    <PageForm.Form
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        includeButtons={false}>
                        <PageForm.YesOrNoQuestion
                            name={PageFormField.harKroniskSyktBarn}
                            legend="Har du et barn som har en kronisk sykdom eller funksjonshemming?"
                        />
                        {values[PageFormField.harKroniskSyktBarn] === YesOrNo.NO && (
                            <Box margin="xl">
                                <AlertStripeInfo>
                                    <p style={{ marginTop: 0 }}>
                                        Søknad om ekstra dager gjelder kun de som har barn med en kronisk sykdom eller
                                        funksjonshemming. Hvis du er hjemme fra jobb pga. koronostengt bhg/skole kan du
                                        bruke av dine vanlige omsorgsdager, du skal ikke søke.
                                    </p>
                                    <p>
                                        Ser mer informasjon om omsorgsdager og koronaviruset i informasjonsboksen lenger
                                        opp på denne siden.
                                    </p>
                                </AlertStripeInfo>
                            </Box>
                        )}
                        {values[PageFormField.harKroniskSyktBarn] === YesOrNo.YES && (
                            <Box margin="xl" textAlignCenter={true}>
                                <Lenke href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                    <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                </Lenke>
                            </Box>
                        )}
                    </PageForm.Form>
                )}
            />
        </Page>
    );
};

export default IntroPage;
