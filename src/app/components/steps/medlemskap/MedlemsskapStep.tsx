import * as React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import {
    validateUtenlandsoppholdNeste12Mnd,
    validateUtenlandsoppholdSiste12Mnd,
    validateYesOrNoIsAnswered
} from 'app/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import getLenker from '../../../lenker';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';

const MedlemsskapStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit, formValues }: StepConfigProps) => {
    const intl = useIntl();
    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                {intlHelper(intl, 'steg.medlemskap.veileder')}{' '}
                <Lenke href={getLenker().medlemskap} target="_blank">
                    nav.no
                </Lenke>
                .
            </CounsellorPanel>
            <FormBlock margin="xxl">
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                    name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'expandableInfo.hvaBetyrDette')}>
                            {intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {formValues.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<AppFormField>
                        name={AppFormField.utenlandsoppholdSiste12Mnd}
                        minDate={date1YearAgo}
                        maxDate={dateToday}
                        validate={validateUtenlandsoppholdSiste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'steg.medlemsskap.opphold.addLabel'),
                            modalTitle: intlHelper(intl, 'steg.medlemsskap.oppholdSiste12.modalTitle'),
                            listTitle: intlHelper(intl, 'steg.medlemsskap.oppholdSiste12.listTitle')
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'expandableInfo.hvaBetyrDette')}>
                            {intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {formValues.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<AppFormField>
                        minDate={dateToday}
                        maxDate={date1YearFromNow}
                        name={AppFormField.utenlandsoppholdNeste12Mnd}
                        validate={validateUtenlandsoppholdNeste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'steg.medlemsskap.opphold.addLabel'),
                            modalTitle: intlHelper(intl, 'steg.medlemsskap.oppholdNeste12.modalTitle'),
                            listTitle: intlHelper(intl, 'steg.medlemsskap.oppholdNeste12.listTitle')
                        }}
                    />
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default MedlemsskapStep;
