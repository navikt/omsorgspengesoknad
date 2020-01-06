import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import {
    validateYesOrNoIsAnswered,
    validateUtenlandsoppholdSiste12Mnd,
    validateUtenlandsoppholdNeste12Mnd
} from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import CounsellorPanel from '../../../../common/components/counsellor-panel/CounsellorPanel';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { Field, FieldProps } from 'formik';
import UtenlandsoppholdListe from 'common/forms/utenlandsopphold/UtenlandsoppholdListe';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { showValidationErrors } from 'app/utils/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, intl, nextStepRoute, ...stepProps }) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { formValues } = stepProps;
    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <Box padBottom="xxl">
                <CounsellorPanel>
                    Medlemskap i folketrygden er nøkkelen til rettigheter fra NAV. Hvis du bor eller jobber i Norge er
                    du vanligvis medlem. Du kan lese mer om medlemskap på{' '}
                    <Lenke href={getLenker().medlemskap} target="_blank">
                        nav.no
                    </Lenke>
                    .
                </CounsellorPanel>
            </Box>

            <YesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                validate={validateYesOrNoIsAnswered}
                helperText={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
            />
            {formValues.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <Box margin="m">
                    <Field name={AppFormField.utenlandsoppholdSiste12Mnd} validate={validateUtenlandsoppholdSiste12Mnd}>
                        {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                            const errorMsgProps = showValidationErrors(status, submitCount)
                                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                : {};
                            return (
                                <UtenlandsoppholdListe
                                    labels={{ tittel: 'Utenlandsopphold siste 12 måneder' }}
                                    utenlandsopphold={field.value}
                                    onChange={(utenlandsopphold: Utenlandsopphold[]) => {
                                        setFieldValue(field.name, utenlandsopphold);
                                    }}
                                    {...errorMsgProps}
                                />
                            );
                        }}
                    </Field>
                </Box>
            )}

            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    helperText={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                />
                {formValues.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                    <Box margin="m">
                        <Field
                            name={AppFormField.utenlandsoppholdNeste12Mnd}
                            validate={validateUtenlandsoppholdNeste12Mnd}>
                            {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                                const errorMsgProps = showValidationErrors(status, submitCount)
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : {};
                                return (
                                    <UtenlandsoppholdListe
                                        labels={{ tittel: 'Utenlandsopphold neste 12 måneder' }}
                                        utenlandsopphold={field.value}
                                        onChange={(utenlandsopphold: Utenlandsopphold[]) => {
                                            setFieldValue(field.name, utenlandsopphold);
                                        }}
                                        {...errorMsgProps}
                                    />
                                );
                            }}
                        </Field>
                    </Box>
                )}
            </Box>
        </FormikStep>
    );
};

export default injectIntl(MedlemsskapStep);
