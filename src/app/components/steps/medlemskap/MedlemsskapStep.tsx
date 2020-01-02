import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import CounsellorPanel from '../../../../common/components/counsellor-panel/CounsellorPanel';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import Modal from 'common/components/modal/Modal';
import UtenlandsoppholdForm from 'common/forms/utenlandsopphold-form/UtenlandsoppholdForm';
import FieldsetBase from 'common/form-components/fieldset-base/FieldsetBase';
import ItemList from 'common/components/item-list/ItemList';
import { Knapp } from 'nav-frontend-knapper';
import { date1YearAgo, dateToday } from 'common/utils/dateUtils';

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, intl, nextStepRoute, ...stepProps }) => {
    const [modalState, setModalState] = React.useState({ isVisible: false });
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
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
            <Modal
                isOpen={modalState.isVisible}
                contentLabel={'Utenlandsopphold'}
                onRequestClose={() => setModalState({ isVisible: false })}>
                <UtenlandsoppholdForm
                    minDate={date1YearAgo}
                    maxDate={dateToday}
                    onCancel={() => setModalState({ isVisible: false })}
                    onSubmit={(values) => {
                        console.log('Dialog submitted', values);
                        setModalState({ isVisible: false });
                    }}
                />
            </Modal>

            <FieldsetBase legend="Hvor har du vært?" helperText="Aasdf">
                <ItemList
                    onDelete={(id) => console.log('delete', id)}
                    onEdit={(id) => console.log('edit', id)}
                    items={[
                        {
                            id: '1',
                            label: 'Element 1'
                        },
                        {
                            id: '21',
                            label: 'Element 21'
                        }
                    ]}
                />
                <Box margin="m">
                    <Knapp htmlType="button" onClick={() => setModalState({ isVisible: true })}>
                        + Legg til opphold
                    </Knapp>
                </Box>
            </FieldsetBase>
            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                    name={AppFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    helperText={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
                />
            </Box>
        </FormikStep>
    );
};

export default injectIntl(MedlemsskapStep);
