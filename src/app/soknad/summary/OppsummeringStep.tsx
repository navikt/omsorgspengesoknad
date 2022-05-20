import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import { Normaltekst } from 'nav-frontend-typografi';
import { SoknadFormField } from '../../types/SoknadFormData';
import DeltBostedAvtaleAttachmentList from '../../components/delt-bosted-avtale-attachment-list/DeltBostedAvtaleAttachmentList';
import LegeerklæringAttachmentList from '../../components/legeerklæring-attachment-list/LegeerklæringAttachmentList';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import AnnetBarnSummary from './AnnetBarnSummary';
import BarnRecveivedFormSApiSummary from './BarnReceivedFromApiSummary';
import { SoknadApiData } from '../../types/SoknadApiData';
import { useSoknadContext } from '../SoknadContext';
import { Person } from '../../types/Person';
import { Barn } from '../../types/Barn';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { isPending } from '@devexperts/remote-data-ts';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import SoknadFormComponents from '../SoknadFormComponents';

type Props = {
    søker: Person;
    barn: Barn[];
    søknadenGjelderEtAnnetBarn: boolean;
    barnetSøknadenGjelder: string;
    apiValues?: SoknadApiData;
};

const OppsummeringStep = ({ søker, barn, søknadenGjelderEtAnnetBarn, barnetSøknadenGjelder, apiValues }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();

    return (
        <SoknadFormStep
            id={StepID.SUMMARY}
            includeValidationSummary={false}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status)}
            onSendSoknad={apiValues ? () => sendSoknad(apiValues) : undefined}>
            <Box margin="xxxl">
                <CounsellorPanel>
                    <FormattedMessage id="steg.oppsummering.info" />
                </CounsellorPanel>
                {apiValues === undefined && <div>Api verdier mangler</div>}
                {apiValues !== undefined && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                {/* Om deg */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                    <Box margin="l">
                                        <Normaltekst>
                                            {formatName(søker.fornavn, søker.etternavn, søker.mellomnavn)}
                                        </Normaltekst>
                                        <Normaltekst>
                                            <FormattedMessage
                                                id="steg.oppsummering.søker.fnr"
                                                values={{ fødselsnummer: søker.fødselsnummer }}
                                            />
                                        </Normaltekst>
                                    </Box>
                                </SummarySection>

                                {/* Om barnet */}
                                <SummarySection header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
                                    <Box margin="l">
                                        {!søknadenGjelderEtAnnetBarn && barn && barn.length > 0 ? (
                                            <BarnRecveivedFormSApiSummary
                                                barn={barn}
                                                barnetSøknadenGjelder={barnetSøknadenGjelder}
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
                                            {apiValues.kroniskEllerFunksjonshemming === false &&
                                                intlHelper(intl, 'Nei')}
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
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.samværsavtale && (
                                        <Box margin="m">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.samværsavtale.header')}>
                                                <DeltBostedAvtaleAttachmentList includeDeletionFunctionality={false} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}
                                </SummarySection>
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <SoknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                name={SoknadFormField.harBekreftetOpplysninger}
                                validate={getCheckedValidator()}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
