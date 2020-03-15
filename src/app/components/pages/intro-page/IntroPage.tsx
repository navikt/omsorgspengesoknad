import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
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
            <Box margin="xxl">
                <AlertStripeAdvarsel>
                    <Lenke href="https://www.nav.no/no/driftsmeldinger/ustabilitet-pa-nav.no-soendag-15mars">
                        Ustabile selvbetjeningstjenester søndag 15. mars
                    </Lenke>
                    .
                </AlertStripeAdvarsel>
            </Box>
            <Box margin="xl" padBottom="l">
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
                                        Søknad om ekstra omsorgsdager gjelder <strong>kun</strong> for de som har
                                        kronisk sykt eller funksjonshemmet barn. Hvis du er hjemme fra jobb på grunn av
                                        koronastengt barnehage eller skole, bruker du av dine vanlige omsorgsdager. Det
                                        er per i dag ikke mulig å få ekstra dager på grunn av koronaviruset.
                                    </p>
                                    <p>
                                        Hvis det kommer endringer rundt dette, vil vi oppatere informasjonen så snart vi
                                        har den.
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
