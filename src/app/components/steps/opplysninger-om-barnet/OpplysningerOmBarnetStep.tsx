import * as React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import AlertStripe from 'nav-frontend-alertstriper';
import { StepID } from '../../../config/stepConfig';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';
import { BarnReceivedFromApi, Person } from '../../../types/Søkerdata';

interface OwnProps {
    barn: BarnReceivedFromApi[];
    søker: Person;
    formValues: OmsorgspengesøknadFormData;
    onValidSubmit: () => void;
}

type Props = OwnProps;

const OpplysningerOmBarnetStep: React.FC<Props> = ({ barn, søker, formValues: values, onValidSubmit }) => {
    const { søknadenGjelderEtAnnetBarn, barnetSøknadenGjelder } = values;
    const hasChosenRegisteredChild = barnetSøknadenGjelder && barnetSøknadenGjelder.length > 0;
    const intl = useIntl();
    return (
        <FormikStep id={StepID.OPPLYSNINGER_OM_BARNET} onValidFormSubmit={onValidSubmit}>
            <>
                {barn.length > 0 && <RegistrertBarnPart søkersBarn={barn} />}
                {(søknadenGjelderEtAnnetBarn || barn.length === 0) && <AnnetBarnPart søkersFnr={søker.fødselsnummer} />}
                {(hasChosenRegisteredChild ||
                    søknadenGjelderEtAnnetBarn === true ||
                    barn.length === 0 ||
                    values[AppFormField.sammeAdresse] !==
                        undefined) /** Do not hide if user has already answered */ && (
                    <>
                        <FormBlock>
                            <AppForm.YesOrNoQuestion
                                legend="Er du folkeregistrert på samme adresse som barnet?"
                                name={AppFormField.sammeAdresse}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        <FormBlock>
                            <AppForm.YesOrNoQuestion
                                name={AppFormField.kroniskEllerFunksjonshemming}
                                legend={intlHelper(intl, 'steg.omBarnet.spm.kroniskEllerFunksjonshemmende')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {values.kroniskEllerFunksjonshemming === YesOrNo.NO && (
                            <Box margin="l">
                                <AlertStripe type={'info'}>
                                    {intlHelper(intl, 'steg.omBarnet.alert.ikkeKroniskSykdom')}
                                </AlertStripe>
                            </Box>
                        )}
                    </>
                )}
            </>
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
