import React from 'react';
import FieldsetBase from '../../form-components/fieldset-base/FieldsetBase';
import { Utenlandsopphold } from './types';
import ItemList from '../../components/item-list/ItemList';
import Box from '../../components/box/Box';
import { Knapp } from 'nav-frontend-knapper';
import Modal from '../../components/modal/Modal';
import UtenlandsoppholdForm from './UtenlandsoppholdForm';
import { date1YearAgo, dateToday } from '../../utils/dateUtils';
import { getCountryName } from '../../components/country-select/CountrySelect';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import moment from 'moment';
import { guid } from 'nav-frontend-js-utils';

interface Props {
    utenlandsopphold: Utenlandsopphold[];
    onChange: (utenlandsopphold: Utenlandsopphold[]) => void;
}

const sortUtenlandsopphold = (u1: Utenlandsopphold, u2: Utenlandsopphold): number => {
    if (moment(u1.fromDate).isSameOrBefore(u2.fromDate)) {
        return -1;
    }
    return 1;
};
const UtenlandsoppholdListe: React.FunctionComponent<Props & InjectedIntlProps> = ({
    utenlandsopphold,
    onChange,
    intl
}) => {
    const [modalState, setModalState] = React.useState<{ isVisible: boolean; utenlandsopphold?: Utenlandsopphold }>({
        isVisible: false
    });

    const handleOnSubmit = (values: Utenlandsopphold) => {
        if (values.id) {
            onChange([...utenlandsopphold.filter((u) => u.id !== values.id), values]);
        } else {
            onChange([...utenlandsopphold, { id: guid(), ...values }].sort(sortUtenlandsopphold));
        }
        setModalState({ isVisible: false });
    };

    const handleEditUtenlandsopphold = (id: string) => {
        const opphold = utenlandsopphold.find((u) => u.id === id);
        if (opphold) {
            setModalState({ isVisible: true, utenlandsopphold: opphold });
        }
    };

    const handleDeleteUtenlandsopphold = (id: string) => {
        onChange([...utenlandsopphold.filter((u) => u.id !== id)]);
    };

    const resetModal = () => {
        setModalState({ isVisible: false, utenlandsopphold: undefined });
    };
    return (
        <div>
            <Modal isOpen={modalState.isVisible} contentLabel={'Utenlandsopphold'} onRequestClose={resetModal}>
                <UtenlandsoppholdForm
                    minDate={date1YearAgo}
                    maxDate={dateToday}
                    onCancel={resetModal}
                    onSubmit={handleOnSubmit}
                    values={modalState.utenlandsopphold}
                />
            </Modal>
            <FieldsetBase legend="Hvor har du vært?" helperText="Aasdf">
                <ItemList
                    onDelete={handleDeleteUtenlandsopphold}
                    onEdit={handleEditUtenlandsopphold}
                    items={utenlandsopphold
                        .filter((u) => u.id !== undefined)
                        .map((u) => ({
                            id: u.id!,
                            label: getCountryName(u.countryCode, intl)
                        }))}
                />
                <Box margin="m">
                    <Knapp htmlType="button" onClick={() => setModalState({ isVisible: true })}>
                        + Legg til opphold
                    </Knapp>
                </Box>
            </FieldsetBase>
        </div>
    );
};

export default injectIntl(UtenlandsoppholdListe);
