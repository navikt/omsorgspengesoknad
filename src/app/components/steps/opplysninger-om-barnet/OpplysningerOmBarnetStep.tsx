import * as React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import {
    AppFormField, OmsorgspengesøknadFormData
} from '../../../types/OmsorgspengesøknadFormData';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormBlock from '../../form-block/FormBlock';
import FormikStep from '../../formik-step/FormikStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';

const OpplysningerOmBarnetStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<OmsorgspengesøknadFormData>();
    const { søknadenGjelderEtAnnetBarn, barnetSøknadenGjelder } = values;
    const hasChosenRegisteredChild = barnetSøknadenGjelder && barnetSøknadenGjelder.length > 0;
    const søkerdata = React.useContext(SøkerdataContext);
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
                        <FormBlock>
                            <AppForm.YesOrNoQuestion
                                legend="Er du folkeregistrert på samme adresse som barnet?"
                                name={AppFormField.sammeAdresse}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
