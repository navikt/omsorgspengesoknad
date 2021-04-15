import * as React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { validateYesOrNo } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';

const OpplysningerOmBarnetStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
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
                    {(søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                        <AnnetBarnPart søkersFnr={søkerdata.person.fødselsnummer} />
                    )}
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
                                    validate={(value) => {
                                        const error = validateYesOrNo(value);
                                        return error
                                            ? intlHelper(intl, 'validation.sammeAdresse.ikkeValgt')
                                            : undefined;
                                    }}
                                />
                            </FormBlock>
                            <FormBlock>
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.kroniskEllerFunksjonshemming}
                                    legend={intlHelper(intl, 'steg.omBarnet.spm.kroniskEllerFunksjonshemmende')}
                                    validate={(value) => {
                                        const error = validateYesOrNo(value);
                                        return error
                                            ? intlHelper(intl, 'validation.kroniskEllerFunksjonshemming.ikkeValgt')
                                            : undefined;
                                    }}
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
