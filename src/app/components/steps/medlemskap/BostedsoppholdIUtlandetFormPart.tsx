import React from 'react';
import { useIntl } from 'react-intl';
import { Field, FieldProps } from 'formik';
import ModalFormAndList, {
    ModalFormAndListLabels
} from 'common/components/modal-form-and-list/ModalFormAndList';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import BostedUtlandForm from 'common/forms/bosted-utland/BostedUtlandForm';
import BostedUtlandListe from 'common/forms/bosted-utland/BostedUtlandListe';
import { BostedUtland } from 'common/forms/bosted-utland/types';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { DateRange } from 'common/utils/dateUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { validateUtenlandsoppholdIPerioden } from 'app/validation/fieldValidations';

interface Props<T> {
    periode: DateRange;
    name: T;
    labels: ModalFormAndListLabels;
}

function BostedsoppholdIUtlandetFormPart<T>({ periode, name, labels }: Props<T>) {
    const intl = useIntl();
    return (
        <Field
            name={name}
            validate={
                periode
                    ? (opphold: Utenlandsopphold[]) => validateUtenlandsoppholdIPerioden(periode, opphold)
                    : undefined
            }>
            {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <>
                        <ModalFormAndList<BostedUtland>
                            items={field.value}
                            error={errorMsgProps?.feil}
                            onChange={(oppholdsliste) => {
                                setFieldValue(field.name, oppholdsliste);
                            }}
                            labels={labels}
                            listRenderer={(onEdit, onDelete) => (
                                <BostedUtlandListe bosteder={field.value} onDelete={onDelete} onEdit={onEdit} />
                            )}
                            formRenderer={(onSubmit, onCancel, bosted) => (
                                <BostedUtlandForm
                                    bosted={bosted}
                                    onCancel={onCancel}
                                    onSubmit={onSubmit}
                                    minDato={periode.from}
                                    maksDato={periode.to}
                                    {...errorMsgProps}
                                />
                            )}
                        />
                    </>
                );
            }}
        </Field>
    );
}
export default BostedsoppholdIUtlandetFormPart;