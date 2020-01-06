import moment from 'moment';

const dateIsWithinRange = (date: Date, minDate: Date, maxDate: Date) => {
    return moment(date).isBetween(minDate, maxDate, 'day', '[]');
};

const validateDateInRange = (date: Date | undefined, minDate: Date, maxDate: Date) => {
    if (date === undefined) {
        return {
            key: 'utenlandsoppholdFormValidation.required'
        };
    }
    if (!dateIsWithinRange(date, minDate, maxDate)) {
        return {
            key: 'utenlandsoppholdFormValidation.dateOutsideRange'
        };
    }
    return undefined;
};

const validateFromDate = (date: Date | undefined, minDate: Date, maxDate: Date, toDate?: Date) => {
    const error = validateDateInRange(date, minDate, maxDate);
    if (error !== undefined) {
        return error;
    }
    if (toDate && moment(date).isAfter(toDate, 'day')) {
        return {
            key: 'utenlandsoppholdFormValidation.fromDateAfterToDate'
        };
    }
    return undefined;
};

const validateToDate = (date: Date | undefined, minDate: Date, maxDate: Date, fromDate?: Date) => {
    const error = validateDateInRange(date, minDate, maxDate);
    if (error !== undefined) {
        return error;
    }
    if (fromDate && moment(date).isBefore(fromDate, 'day')) {
        return {
            key: 'utenlandsoppholdFormValidation.toDateBeforeFromDate'
        };
    }
    return undefined;
};

const validateCountry = (country: string) => {
    if (country) {
        return null;
    }
    return {
        key: 'utenlandsoppholdFormValidation.required'
    };
};

const utenlandsoppholdFormValidation = {
    validateCountry,
    validateFromDate,
    validateToDate
};

export default utenlandsoppholdFormValidation;
