import { UtenlandsoppholdFormValues } from './UtenlandsoppholdForm';
import moment from 'moment';

const dates = {
    today: moment(),
    yesterday: moment().subtract(1, 'day'),
    tomorrow: moment().add(1, 'day'),
    oneYearInPast: moment().subtract(1, 'year'),
    oneYearInFuture: moment().add(1, 'year')
};

const dateIsWithinOneYearInPast = (date: Date) => {
    return moment(date).isBetween(dates.oneYearInPast, dates.today, 'day', '[]');
};

const dateIsWithinOneYearInFuture = (date: Date) => {
    return moment(date).isBetween(dates.today, dates.oneYearInFuture, 'day', '[]');
};

const validateFromDate = (date: Date | undefined, values: Partial<UtenlandsoppholdFormValues>) => {
    if (date === undefined) {
        return {
            key: 'utenlandsoppholdFormValidation.påkrevd'
        };
    }
    if (!dateIsWithinOneYearInPast(date)) {
        return {
            key: 'utenlandsoppholdFormValidation.fom.ugyldigDato'
        };
    }
    if (values.toDate && moment(date).isAfter(values.toDate, 'day')) {
        return {
            key: 'utenlandsoppholdFormValidation.fom.etterTom'
        };
    }
    return undefined;
};

const validateToDate = (date: Date | undefined, values: Partial<UtenlandsoppholdFormValues>) => {
    if (date === undefined) {
        return {
            key: 'utenlandsoppholdFormValidation.påkrevd'
        };
    }
    if (!dateIsWithinOneYearInFuture(date)) {
        return {
            key: 'utenlandsoppholdFormValidation.tom.ugyldigDato'
        };
    }
    if (values.fromDate && moment(date).isBefore(values.fromDate, 'day')) {
        return {
            key: 'utenlandsoppholdFormValidation.tom.førTom'
        };
    }
    return undefined;
};

const validateCountry = (country: string) => {
    if (country) {
        return null;
    }
    return {
        key: 'fieldvalidation.påkrevd'
    };
};

const utenlandsoppholdFormValidation = {
    validateCountry,
    validateFromDate,
    validateToDate
};

export default utenlandsoppholdFormValidation;
