import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { FormikConfirmationCheckboxPanel } from '@navikt/sif-common-formik/lib';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { sendApplication } from '../../../api/api';
import { SKJEMANAVN } from '../../../App';
import routeConfig from '../../../config/routeConfig';
import { getStepConfig, StepID } from '../../../config/stepConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import * as apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import appSentryLogger from '../../../utils/appSentryLogger';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import DeltBostedAvtaleAttachmentList from '../../delt-bosted-avtale-attachment-list/DeltBostedAvtaleAttachmentList';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringAttachmentList from '../../legeerklæring-attachment-list/LegeerklæringAttachmentList';
import SummarySection from '../../summary-section/SummarySection';
import AnnetBarnSummary from './AnnetBarnSummary';
import BarnRecveivedFormSApiSummary from './BarnReceivedFromApiSummary';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { useState } from 'react';
import { validateApiValues } from '../../../validation/apiValuesValidation';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ApiValidationSummary from './api-validation-summary/ApiValidationSummary';
import { useFormikContext } from 'formik';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { OmsorgspengesøknadApiData } from '../../../types/OmsorgspengesøknadApiData';

interface Props {
    registrerteBarn: BarnReceivedFromApi[];
    onApplicationSent: () => void;
}

const SummaryStep: React.FC<Props> = ({ registrerteBarn, onApplicationSent }) => {
    const intl = useIntl();
    const { values } = useFormikContext<OmsorgspengesøknadFormData>();
    const søkerdata = React.useContext(SøkerdataContext);
    const [sendingInProgress, setSendingInProgress] = useState(false);
    const history = useHistory();
    const søknadStepConfig = getStepConfig(values);

    const { logSoknadFailed, logSoknadSent } = useAmplitudeInstance();

    const soknadFailed = async (error: any) => {
        appSentryLogger.logApiError(error);
        await logSoknadFailed(SKJEMANAVN);
        navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
    };

    const sendSoknad = async (data: OmsorgspengesøknadApiData) => {
        setSendingInProgress(true);

        try {
            await sendApplication(data);
            await logSoknadSent(SKJEMANAVN);
            onApplicationSent();
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                navigateToLoginPage();
            } else {
                soknadFailed(error);
            }
        }
    };

    if (!søkerdata) {
        return null;
    }

    const {
        person: { fornavn, mellomnavn, etternavn, fødselsnummer },
    } = søkerdata;

    const apiValues = mapFormDataToApiData(values, registrerteBarn, intl.locale as Locale);
    const apiValuesValidationErrors = validateApiValues(apiValues, intl);

    return (
        <FormikStep
            id={StepID.SUMMARY}
            onValidFormSubmit={() => {
                setTimeout(() => {
                    sendSoknad(apiValues); // La view oppdatere seg først
                });
            }}
            useValidationErrorSummary={false}
            showButtonSpinner={sendingInProgress}
            buttonDisabled={sendingInProgress || (apiValuesValidationErrors && apiValuesValidationErrors.length > 0)}>
            <CounsellorPanel>
                <FormattedMessage id="steg.oppsummering.info" />
            </CounsellorPanel>
            {apiValuesValidationErrors && apiValuesValidationErrors.length > 0 && (
                <FormBlock>
                    <ApiValidationSummary errors={apiValuesValidationErrors} søknadStepConfig={søknadStepConfig} />
                </FormBlock>
            )}
            <Box margin="xl">
                <Panel border={true}>
                    {/* Om deg */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                        <Box margin="l">
                            <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                            <Normaltekst>
                                <FormattedMessage id="steg.oppsummering.søker.fnr" values={{ fødselsnummer }} />
                            </Normaltekst>
                        </Box>
                    </SummarySection>

                    {/* Om barnet */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
                        <Box margin="l">
                            {!values.søknadenGjelderEtAnnetBarn && registrerteBarn && registrerteBarn.length > 0 ? (
                                <BarnRecveivedFormSApiSummary
                                    barn={registrerteBarn}
                                    barnetSøknadenGjelder={values.barnetSøknadenGjelder}
                                />
                            ) : (
                                <AnnetBarnSummary apiValues={apiValues} />
                            )}
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader
                                header={intlHelper(
                                    intl,
                                    'steg.oppsummering.barnet.kroniskEllerFunksjonshemmende.header'
                                )}>
                                {apiValues.kroniskEllerFunksjonshemming === true && intlHelper(intl, 'Ja')}
                                {apiValues.kroniskEllerFunksjonshemming === false && intlHelper(intl, 'Nei')}
                            </ContentWithHeader>
                        </Box>
                        <Box margin="l">
                            <ContentWithHeader
                                header={intlHelper(intl, 'steg.oppsummering.barnet.sammeAdresse.header')}>
                                {apiValues.sammeAdresse === true && intlHelper(intl, 'Ja')}
                                {apiValues.sammeAdresse === false && intlHelper(intl, 'Nei')}
                            </ContentWithHeader>
                        </Box>
                    </SummarySection>

                    {/* Vedlegg */}
                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.vedlegg.header')}>
                        <Box margin="m">
                            <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                            </ContentWithHeader>
                        </Box>
                        {apiValues.samværsavtale && (
                            <Box margin="m">
                                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.samværsavtale.header')}>
                                    <DeltBostedAvtaleAttachmentList includeDeletionFunctionality={false} />
                                </ContentWithHeader>
                            </Box>
                        )}
                    </SummarySection>
                </Panel>
            </Box>

            <Box margin="l">
                <FormikConfirmationCheckboxPanel<AppFormField, ValidationError>
                    label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                    name={AppFormField.harBekreftetOpplysninger}
                    validate={getCheckedValidator()}
                />
            </Box>
        </FormikStep>
    );
};

export default SummaryStep;
