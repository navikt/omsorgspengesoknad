import * as React from 'react';
import { useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { validateRequiredList } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { HistoryProps } from 'common/types/History';
import { YesOrNo } from 'common/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { Feature, isFeatureEnabled } from 'app/utils/featureToggleUtils';
import { navigateTo } from 'app/utils/navigationUtils';
import { validateYesOrNoIsAnswered } from 'app/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import getLenker from '../../../lenker';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';

type Props = CommonStepFormikProps & HistoryProps & StepConfigProps;

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, nextStepRoute, ...stepProps }) => {
    const { formValues } = stepProps;
    const intl = useIntl();

    return (
        <FormikStep
            id={StepID.MEDLEMSKAP}
            onValidFormSubmit={() => navigateTo(nextStepRoute!, history)}
            history={history}
            {...stepProps}>
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
            <FormikYesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={AppFormField.harBoddUtenforNorgeSiste12Mnd}
                validate={validateYesOrNoIsAnswered}
                helperText={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
            />
            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) &&
                formValues.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                    <Box margin="m">
                        <BostedUtlandListAndDialog<AppFormField>
                            name={AppFormField.utenlandsoppholdSiste12Mnd}
                            minDate={date1YearAgo}
                            maxDate={dateToday}
                            validate={validateRequiredList}
                            labels={{
                                addLabel: 'Legg til nytt utenlandsopphold',
                                listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                                modalTitle: 'Utenlandsopphold siste 12 måneder',
                                emptyListText: 'Ingen opphold er registrert'
                            }}
                        />
                    </Box>
                )}
            <Box margin="xl">
                <FormikYesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    helperText={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                />
            </Box>
            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) &&
                formValues.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                    <Box margin="m">
                        <BostedUtlandListAndDialog<AppFormField>
                            minDate={dateToday}
                            maxDate={date1YearFromNow}
                            name={AppFormField.utenlandsoppholdNeste12Mnd}
                            validate={validateRequiredList}
                            labels={{
                                addLabel: 'Legg til nytt utenlandsopphold',
                                listTitle: intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.listeTittel'),
                                modalTitle: 'Utenlandsopphold neste 12 måneder',
                                emptyListText: 'Ingen opphold er registrert'
                            }}
                        />
                    </Box>
                )}
        </FormikStep>
    );
};

export default MedlemsskapStep;
