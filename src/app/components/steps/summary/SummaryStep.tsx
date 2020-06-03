import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { FormikConfirmationCheckboxPanel } from '@navikt/sif-common-formik/lib';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import SummaryList from 'common/components/summary-list/SummaryList';
import { Locale } from 'common/types/Locale';
import intlHelper from 'common/utils/intlUtils';
import { formatName } from 'common/utils/personUtils';
import { renderUtenlandsoppholdSummary } from 'app/components/summary-renderers/renderUtenlandsoppholdSummary';
import { sendApplication } from '../../../api/api';
import routeConfig from '../../../config/routeConfig';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi, Søkerdata } from '../../../types/Søkerdata';
import * as apiUtils from '../../../utils/apiUtils';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import DeltBostedAvtaleAttachmentList from '../../delt-bosted-avtale-attachment-list/DeltBostedAvtaleAttachmentList';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringAttachmentList from '../../legeerklæring-attachment-list/LegeerklæringAttachmentList';
import AnnetBarnSummary from './AnnetBarnSummary';
import BarnRecveivedFormSApiSummary from './BarnReceivedFromApiSummary';

const SummaryStep = ({ formValues }: StepConfigProps) => {
    const intl = useIntl();
    const [sendingInProgress, setSendingInProgress] = React.useState<boolean>(false);
    const history = useHistory();

    async function sendSoknad(barn: BarnReceivedFromApi[]) {
        setSendingInProgress(true);
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
    return (
        <SøkerdataContextConsumer>
            {({ person: { fornavn, mellomnavn, etternavn, fødselsnummer }, barn }: Søkerdata) => {
                const apiValues = mapFormDataToApiData(formValues, barn, intl.locale as Locale);
                const { medlemskap } = apiValues;

                return (
                    <FormikStep
                        id={StepID.SUMMARY}
                        onValidFormSubmit={() => sendSoknad(barn)}
                        useValidationErrorSummary={false}
                        showButtonSpinner={sendingInProgress}
                        buttonDisabled={sendingInProgress}>
                        <CounsellorPanel>
                            <FormattedMessage id="steg.oppsummering.info" />
                        </CounsellorPanel>
                        <Box margin="xl">
                            <Panel border={true}>
                                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                    <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                    <Normaltekst>
                                        <FormattedMessage id="steg.oppsummering.søker.fnr" values={{ fødselsnummer }} />
                                    </Normaltekst>
                                </ContentWithHeader>

                                <Box margin="l">
                                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
                                        {!formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0 ? (
                                            <BarnRecveivedFormSApiSummary
                                                barn={barn}
                                                barnetSøknadenGjelder={formValues.barnetSøknadenGjelder}
                                            />
                                        ) : (
                                            <AnnetBarnSummary apiValues={apiValues} />
                                        )}
                                    </ContentWithHeader>
                                </Box>

                                <Box margin="l">
                                    <ContentWithHeader
                                        header={intlHelper(intl, 'steg.oppsummering.barnet.sammeAdresse.header')}>
                                        {apiValues.sammeAdresse === true && intlHelper(intl, 'Ja')}
                                        {apiValues.sammeAdresse === false && intlHelper(intl, 'Nei')}
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
                                        {medlemskap.harBoddIUtlandetSiste12Mnd === true && intlHelper(intl, 'Ja')}
                                        {medlemskap.harBoddIUtlandetSiste12Mnd === false && intlHelper(intl, 'Nei')}
                                    </ContentWithHeader>
                                </Box>
                                {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                    medlemskap.utenlandsoppholdSiste12Mnd.length > 0 && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.utlandetSiste12.liste.header'
                                                )}>
                                                <SummaryList
                                                    items={medlemskap.utenlandsoppholdSiste12Mnd}
                                                    itemRenderer={renderUtenlandsoppholdSummary}
                                                />
                                            </ContentWithHeader>
                                        </Box>
                                    )}

                                <Box margin="l">
                                    <ContentWithHeader
                                        header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                        {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                            intlHelper(intl, 'Ja')}
                                        {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === false &&
                                            intlHelper(intl, 'Nei')}
                                    </ContentWithHeader>
                                </Box>

                                {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                    medlemskap.utenlandsoppholdNeste12Mnd.length > 0 && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.utlandetNeste12.liste.header'
                                                )}>
                                                <SummaryList
                                                    items={medlemskap.utenlandsoppholdNeste12Mnd}
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
                                {apiValues.samværsavtale && (
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.samværsavtale.header')}>
                                            <DeltBostedAvtaleAttachmentList includeDeletionFunctionality={false} />
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
};

export default SummaryStep;
