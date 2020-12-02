import * as React from 'react';
import { useFormikContext } from 'formik';
import FormBlock from 'common/components/form-block/FormBlock';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';

const OpplysningerOmBarnetStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<OmsorgspengesøknadFormData>();
    const { søknadenGjelderEtAnnetBarn, barnetSøknadenGjelder } = values;
    const hasChosenRegisteredChild = barnetSøknadenGjelder && barnetSøknadenGjelder.length > 0;
    const søkerdata = React.useContext(SøkerdataContext);
    const intl = useIntl();
    return (
        <FormikStep id={StepID.OPPLYSNINGER_OM_BARNET} onValidFormSubmit={onValidSubmit}>
            {søkerdata && (
                <>
                    {harRegistrerteBarn(søkerdata) && <RegistrertBarnPart søkersBarn={søkerdata.barn} />}
                    {(søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && <AnnetBarnPart />}
                    {(hasChosenRegisteredChild ||
                        søknadenGjelderEtAnnetBarn === true ||
                        søkerdata.barn.length === 0 ||
                        values[AppFormField.sammeAdresse] !==
                            undefined) /** Do not hide if user has already answered */ && (
                        <>
                            <FormBlock>
                                <AppForm.YesOrNoQuestion
                                    legend="Er du folkeregistrert på samme adresse som barnet?"
                                    name={AppFormField.sammeAdresse}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </FormBlock>
                            <FormBlock>
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.kroniskEllerFunksjonshemming}
                                    legend={intlHelper(intl, 'steg.omBarnet.spm.kroniskEllerFunksjonshemmende')}
                                    validate={validateYesOrNoIsAnswered}
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
            )}
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
