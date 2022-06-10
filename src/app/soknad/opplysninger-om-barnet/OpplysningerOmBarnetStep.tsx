import * as React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import AlertStripe from 'nav-frontend-alertstriper';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import AnnetBarnPart from './AnnetBarnPart';
import { Barn } from '../../types/Barn';
import { Person } from '../../types/Person';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import RegistrertBarnPart from './RegistrertBarnPart';
import SoknadFormComponents from '../SoknadFormComponents';

interface Props {
    barn: Barn[];
    søker: Person;
    formData: SoknadFormData;
}

const OpplysningerOmBarnetStep: React.FC<Props> = ({ barn, formData, søker }) => {
    const { søknadenGjelderEtAnnetBarn, barnetSøknadenGjelder } = formData;
    const hasChosenRegisteredChild = barnetSøknadenGjelder && barnetSøknadenGjelder.length > 0;
    const intl = useIntl();

    return (
        <SoknadFormStep id={StepID.OPPLYSNINGER_OM_BARNET}>
            <>
                {barn.length > 0 && <RegistrertBarnPart søkersBarn={barn} />}
                {(søknadenGjelderEtAnnetBarn || barn.length === 0) && <AnnetBarnPart søkersFnr={søker.fødselsnummer} />}
                {(hasChosenRegisteredChild ||
                    søknadenGjelderEtAnnetBarn === true ||
                    barn.length === 0 ||
                    formData[SoknadFormField.sammeAdresse] !==
                        undefined) /** Do not hide if user has already answered */ && (
                    <>
                        <FormBlock>
                            <SoknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.omBarnet.spm.sammeAdresse')}
                                name={SoknadFormField.sammeAdresse}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        <FormBlock>
                            <SoknadFormComponents.YesOrNoQuestion
                                name={SoknadFormField.kroniskEllerFunksjonshemming}
                                legend={intlHelper(intl, 'steg.omBarnet.spm.kroniskEllerFunksjonshemmende')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {formData.kroniskEllerFunksjonshemming === YesOrNo.NO && (
                            <Box margin="l">
                                <AlertStripe type={'info'}>
                                    {intlHelper(intl, 'steg.omBarnet.alert.ikkeKroniskSykdom')}
                                </AlertStripe>
                            </Box>
                        )}
                    </>
                )}
            </>
        </SoknadFormStep>
    );
};

export default OpplysningerOmBarnetStep;
