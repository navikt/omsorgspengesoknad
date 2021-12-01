import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Knappelenke from '@navikt/sif-common-core/lib/components/knappelenke/Knappelenke';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, UnansweredQuestionsInfo, YesOrNo } from '@navikt/sif-common-formik/lib';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import RouteConfig, { getRouteUrl } from '../../../config/routeConfig';
import './introPage.less';

const bem = bemUtils('introPage');

enum PageFormField {
    'harKroniskSyktBarn' = 'harKroniskSyktBarn',
}

interface PageFormValues {
    [PageFormField.harKroniskSyktBarn]: YesOrNo;
}

const PageForm = getTypedFormComponents<PageFormField, PageFormValues, ValidationError>();

const IntroPage: React.FunctionComponent = () => {
    const intl = useIntl();
    const initialValues = {};
    useLogSidevisning(SIFCommonPageKey.intro);

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner tag="h1" text={intlHelper(intl, 'introPage.stegTittel')} />}>
            <Box margin="xxxl" padBottom="xxl">
                <InformationPoster>
                    <p>
                        <FormattedHtmlMessage id="introPage.intro.1.html" />
                    </p>
                    <p>
                        <FormattedHtmlMessage id="introPage.intro.1.2" />
                    </p>
                    <div>
                        <FormattedMessage id="introPage.intro.2" />
                        <ul>
                            <li>
                                <FormattedMessage id="introPage.intro.2.1" />
                            </li>
                            <li>
                                <FormattedMessage id="introPage.intro.2.2" />
                            </li>
                            <li>
                                <FormattedMessage id="introPage.intro.2.3" />
                            </li>
                        </ul>
                    </div>
                </InformationPoster>
            </Box>

            <PageForm.FormikWrapper
                onSubmit={() => null}
                initialValues={initialValues}
                renderForm={({ values }) => {
                    const showNotAllQuestionsAnsweredMessage = values.harKroniskSyktBarn === undefined;

                    return (
                        <PageForm.Form
                            includeButtons={false}
                            formErrorHandler={intlFormErrorHandler(intl, 'introForm')}
                            noButtonsContentRenderer={
                                showNotAllQuestionsAnsweredMessage
                                    ? () => (
                                          <UnansweredQuestionsInfo>
                                              <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                          </UnansweredQuestionsInfo>
                                      )
                                    : undefined
                            }>
                            <PageForm.YesOrNoQuestion
                                name={PageFormField.harKroniskSyktBarn}
                                legend={intlHelper(intl, 'introPage.spm.kroniskEllerFunksjonshemmende')}
                            />
                            {values[PageFormField.harKroniskSyktBarn] === YesOrNo.NO && (
                                <Box margin="xl">
                                    <AlertStripeInfo>
                                        <p data-cy="harIkkeKroniskSyktBarn" style={{ marginTop: 0, marginBottom: 0 }}>
                                            <FormattedHtmlMessage id="introPage.info.harIkkeKroniskSyktBarn.html" />
                                        </p>
                                    </AlertStripeInfo>
                                </Box>
                            )}
                            {values[PageFormField.harKroniskSyktBarn] === YesOrNo.YES && (
                                <Box
                                    margin="xl"
                                    textAlignCenter={true}
                                    className={bem.element('gaTilSoknadenKnappelenkeWrapper')}>
                                    <Knappelenke type={'hoved'} href={getRouteUrl(RouteConfig.WELCOMING_PAGE_ROUTE)}>
                                        <FormattedMessage id="gotoApplicationLink.lenketekst" />
                                    </Knappelenke>
                                </Box>
                            )}
                        </PageForm.Form>
                    );
                }}
            />
        </Page>
    );
};

export default IntroPage;
