import React from 'react';
import FieldsetBase from '../../form-components/fieldset-base/FieldsetBase';
import { Utenlandsopphold } from './types';
import ItemList from '../../components/item-list/ItemList';
import Box from '../../components/box/Box';
import { Knapp } from 'nav-frontend-knapper';
import Modal from '../../components/modal/Modal';
import UtenlandsoppholdForm from './UtenlandsoppholdForm';
import { prettifyDateExtended, DateRange } from '../../utils/dateUtils';
import { getCountryName } from '../../components/country-select/CountrySelect';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import moment from 'moment';
import { guid } from 'nav-frontend-js-utils';
import ActionLink from '../../components/action-link/ActionLink';
import bemUtils from '../../utils/bemUtils';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';

import './utenlandsoppholdListe.less';

interface Props {
    labels: {
        tittel: string;
        helpertext?: string;
    };
    tidsrom: DateRange;
    feil?: SkjemaelementFeil;
    utenlandsopphold: Utenlandsopphold[];
    onChange: (utenlandsopphold: Utenlandsopphold[]) => void;
}

const bem = bemUtils('utenlandsoppholdListe');

const sortUtenlandsopphold = (u1: Utenlandsopphold, u2: Utenlandsopphold): number => {
    if (moment(u1.fromDate).isSameOrBefore(u2.fromDate)) {
        return -1;
    }
    return 1;
};

const UtenlandsoppholdListe: React.FunctionComponent<Props & InjectedIntlProps> = ({
    labels,
    utenlandsopphold,
    onChange,
    tidsrom,
    feil,
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
        const opphold = getUtenlandsopphold(id);
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

    const getUtenlandsopphold = (id: string): Utenlandsopphold | undefined => {
        return utenlandsopphold.find((u) => u.id === id);
    };

    const renderUtenlandsoppholdLabel = (id: string): React.ReactNode => {
        const opphold = getUtenlandsopphold(id);
        if (!opphold) {
            return <div>"N/A"</div>;
        }
        const navn = getCountryName(opphold.countryCode, intl);
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('land')}>
                    <ActionLink onClick={() => handleEditUtenlandsopphold(opphold.id!)}>{navn}</ActionLink>
                </span>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(opphold.fromDate)} - {prettifyDateExtended(opphold.toDate)}
                </span>
            </div>
        );
    };

    return (
        <div className={bem.block}>
            <Modal isOpen={modalState.isVisible} contentLabel={'Utenlandsopphold'} onRequestClose={resetModal}>
                <UtenlandsoppholdForm
                    minDate={tidsrom.from}
                    maxDate={tidsrom.to}
                    onCancel={resetModal}
                    onSubmit={handleOnSubmit}
                    values={modalState.utenlandsopphold}
                />
            </Modal>
            <FieldsetBase legend={labels.tittel} helperText={labels.helpertext} feil={feil}>
                <ItemList
                    onDelete={handleDeleteUtenlandsopphold}
                    onEdit={handleEditUtenlandsopphold}
                    labelRenderer={renderUtenlandsoppholdLabel}
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
