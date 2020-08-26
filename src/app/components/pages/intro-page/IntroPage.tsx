import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
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
import './introPage.less';
import Knappelenke from 'common/components/knappelenke/Knappelenke';

const bem = bemUtils('introPage');

enum PageFormField {
    'harKroniskSyktBarn' = 'harKroniskSyktBarn'
}

interface PageFormValues {
    [PageFormField.harKroniskSyktBarn]: YesOrNo;
}

const PageForm = getTypedFormComponents<PageFormField, PageFormValues>();

const showSystemUnstabilityMessage = false;

const IntroPage: React.StatelessComponent = () => {
    const intl = useIntl();
    const initialValues = {};
    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            {showSystemUnstabilityMessage && (
                <Box margin="xxl">
                    <AlertStripeAdvarsel>
                        <Lenke href="https://www.nav.no/no/driftsmeldinger/ustabilitet-pa-nav.no-soendag-15mars">
                            Ustabile selvbetjeningstjenester søndag 15. mars
                        </Lenke>
                        .
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin="xxxl" padBottom="xxl">
                <InformationPoster>
                    <p>
                        Den digitale søknaden er under utvikling og kan foreløpig <strong>kun</strong> brukes til å søke
                        om ekstra omsorgsdager for barn med kronisk sykdom eller funksjonshemning.
                    </p>
                    <div>
                        For å søke må du være i én eller flere av disse arbeidssituasjonene:
                        <ul>
                            <li>arbeidstaker</li>
                            <li>selvstendig næringsdrivende</li>
                            <li>frilanser</li>
                        </ul>
                    </div>
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
                                    <p data-cy="harIkkeKroniskSyktBarn" style={{ marginTop: 0, marginBottom: 0 }}>
                                        Søknad om ekstra omsorgsdager gjelder <strong>kun</strong> for de som har
                                        kronisk sykt eller funksjonshemmet barn.
                                    </p>
                                </AlertStripeInfo>
                            </Box>
                        )}
                        {values[PageFormField.harKroniskSyktBarn] === YesOrNo.YES && (
                            <Box
                                margin="xl"
                                textAlignCenter={true}
                                className={bem.element('gaTilSoknadenKnappelenkeWrapper')}>
                                <Knappelenke
                                    type={'hoved'}
                                    href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                    <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                </Knappelenke>
                            </Box>
                        )}
                    </PageForm.Form>
                )}
            />
        </Page>
    );
};

export default IntroPage;
