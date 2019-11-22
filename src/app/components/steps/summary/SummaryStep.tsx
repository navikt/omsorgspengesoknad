import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import Box from '../../../../common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import Panel from '../../../../common/components/panel/Panel';
import ContentWithHeader from '../../../../common/components/content-with-header/ContentWithHeader';
import LegeerklæringAttachmentList from '../../legeerklæring-file-list/LegeerklæringFileList';
import { prettifyDate } from '../../../../common/utils/dateUtils';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { BarnReceivedFromApi, Søkerdata } from '../../../types/Søkerdata';
import { formatName } from '../../../../common/utils/personUtils';
import { sendApplication } from '../../../api/api';
import routeConfig from '../../../config/routeConfig';
import CounsellorPanel from '../../../../common/components/counsellor-panel/CounsellorPanel';
import * as apiUtils from '../../../utils/apiUtils';
import ContentSwitcher from '../../../../common/components/content-switcher/ContentSwitcher';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { Locale } from 'common/types/Locale';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';

interface State {
    sendingInProgress: boolean;
}

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps;

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sendingInProgress: false
        };
        this.navigate = this.navigate.bind(this);
    }

    async navigate(barn: BarnReceivedFromApi[]) {
        const { history, formValues, intl } = this.props;
        this.setState({
            sendingInProgress: true
        });
        if (appIsRunningInDemoMode()) {
            navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
        } else {
            try {
                await sendApplication(mapFormDataToApiData(formValues, barn, intl.locale as Locale));
                navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
                }
            }
        }
    }

    render() {
        const { handleSubmit, formValues, history, intl } = this.props;
        const { sendingInProgress } = this.state;
        const stepProps = {
            formValues,
            handleSubmit,
            showButtonSpinner: sendingInProgress,
            buttonDisabled: sendingInProgress
        };

        return (
            <SøkerdataContextConsumer>
                {({ person: { fornavn, mellomnavn, etternavn, fodselsnummer }, barn }: Søkerdata) => {
                    const apiValues = mapFormDataToApiData(formValues, barn, intl.locale as Locale);

                    return (
                        <FormikStep
                            id={StepID.SUMMARY}
                            onValidFormSubmit={() => this.navigate(barn)}
                            history={history}
                            useValidationErrorSummary={false}
                            {...stepProps}>
                            <CounsellorPanel>
                                <FormattedMessage id="steg.oppsummering.info" />
                            </CounsellorPanel>
                            <Box margin="xl">
                                <Panel border={true}>
                                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                        <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                        <Normaltekst>
                                            <FormattedMessage
                                                id="steg.oppsummering.søker.fnr"
                                                values={{ fodselsnummer }}
                                            />
                                        </Normaltekst>
                                    </ContentWithHeader>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                            <Normaltekst>
                                                <FormattedMessage
                                                    id="steg.oppsummering.tidsrom.fomtom"
                                                    values={{
                                                        fom: prettifyDate(apiValues.fra_og_med),
                                                        tom: prettifyDate(apiValues.til_og_med)
                                                    }}
                                                />
                                            </Normaltekst>
                                        </ContentWithHeader>
                                    </Box>
                                    <Box margin="l">
                                        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
                                            <ContentSwitcher
                                                firstContent={() => {
                                                    const barnReceivedFromApi = barn.find(
                                                        ({ aktoer_id }) =>
                                                            aktoer_id === formValues.barnetSøknadenGjelder
                                                    );
                                                    return barnReceivedFromApi ? (
                                                        <>
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.navn"
                                                                    values={{
                                                                        navn: formatName(
                                                                            barnReceivedFromApi!.fornavn,
                                                                            barnReceivedFromApi!.etternavn,
                                                                            barnReceivedFromApi!.mellomnavn
                                                                        )
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.fodselsdato"
                                                                    values={{
                                                                        dato: prettifyDate(
                                                                            barnReceivedFromApi!.fodselsdato
                                                                        )
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    );
                                                }}
                                                secondContent={() => (
                                                    <>
                                                        {apiValues.barn.alternativ_id ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.forelopigFnr"
                                                                    values={{
                                                                        fnr: apiValues.barn.alternativ_id
                                                                    }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        {!apiValues.barn.alternativ_id ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.fnr"
                                                                    values={{ fnr: apiValues.barn.fodselsnummer }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        {apiValues.barn.navn ? (
                                                            <Normaltekst>
                                                                <FormattedMessage
                                                                    id="steg.oppsummering.barnet.navn"
                                                                    values={{ navn: apiValues.barn.navn }}
                                                                />
                                                            </Normaltekst>
                                                        ) : null}
                                                        <Normaltekst>
                                                            <FormattedMessage
                                                                id="steg.oppsummering.barnet.søkersRelasjonTilBarnet"
                                                                values={{ relasjon: apiValues.relasjon_til_barnet }}
                                                            />
                                                        </Normaltekst>
                                                    </>
                                                )}
                                                showFirstContent={
                                                    !formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0
                                                }
                                            />
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                            {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </ContentWithHeader>
                                    </Box>
                                </Panel>
                            </Box>
                            <Box margin="l">
                                <ConfirmationCheckboxPanel
                                    label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                    name={AppFormField.harBekreftetOpplysninger}
                                    validate={(value) => {
                                        let result;
                                        if (value !== true) {
                                            result = intlHelper(
                                                intl,
                                                'steg.oppsummering.bekrefterOpplysninger.ikkeBekreftet'
                                            );
                                        }
                                        return result;
                                    }}
                                />
                            </Box>
                        </FormikStep>
                    );
                }}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(SummaryStep);
