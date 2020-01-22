import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import Box from '../../../../common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import Panel from '../../../../common/components/panel/Panel';
import ContentWithHeader from '../../../../common/components/content-with-header/ContentWithHeader';
import LegeerklæringAttachmentList from '../../legeerklæring-attachment-list/LegeerklæringAttachmentList';
import { prettifyDate } from '../../../../common/utils/dateUtils';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { BarnReceivedFromApi, Søkerdata } from '../../../types/Søkerdata';
import { formatName } from '../../../../common/utils/personUtils';
import { sendApplication } from '../../../api/api';
import routeConfig from '../../../config/routeConfig';
import CounsellorPanel from '../../../../common/components/counsellor-panel/CounsellorPanel';
import * as apiUtils from '../../../utils/apiUtils';
import ContentSwitcher from '../../../../common/components/content-switcher/ContentSwitcher';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import { Locale } from 'common/types/Locale';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import SamværsavtaleAttachmentList from '../../samværsavtale-attachment-list/SamværsavtaleAttachmentList';
import SummaryList from 'common/components/summary-list/SummaryList';
import { renderUtenlandsoppholdSummary } from 'app/components/summary-renderers/renderUtenlandsoppholdSummary';
import FormikConfirmationCheckboxPanel from 'common/formik/formik-confirmation-checkbox-panel/FormikConfirmationCheckboxPanel';

interface State {
    sendingInProgress: boolean;
}

type Props = CommonStepFormikProps & HistoryProps & WrappedComponentProps;

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
                    const { medlemskap } = apiValues;

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
                                                                values={{
                                                                    relasjon: intlHelper(
                                                                        intl,
                                                                        `relasjonTilBarnet.${apiValues.relasjon_til_barnet}`
                                                                    )
                                                                }}
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
                                            header={intlHelper(intl, 'steg.oppsummering.barnet.sammeAdresse.header')}>
                                            {apiValues.samme_adresse === true && intlHelper(intl, 'Ja')}
                                            {apiValues.samme_adresse === false && intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
                                            {apiValues.arbeidssituasjon.map((a) => (
                                                <li key={a}>
                                                    <FormattedMessage id={`arbeidssituasjon.${a}`} />
                                                </li>
                                            ))}
                                        </ContentWithHeader>
                                    </Box>

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                            {medlemskap.har_bodd_i_utlandet_siste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {medlemskap.har_bodd_i_utlandet_siste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === true &&
                                        medlemskap.utenlandsopphold_siste_12_mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetSiste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsopphold_siste_12_mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                        medlemskap.utenlandsopphold_neste_12_mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetNeste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsopphold_neste_12_mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}

                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.samvarsavtale && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.samværsavtale.header')}>
                                                <SamværsavtaleAttachmentList includeDeletionFunctionality={false} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}
                                </Panel>
                            </Box>
                            <Box margin="l">
                                <FormikConfirmationCheckboxPanel<AppFormField>
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
