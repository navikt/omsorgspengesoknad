import moment from 'moment';
import validation from '../utenlandsoppholdFormValidation';

const { validateFromDate, validateToDate } = validation;

const dates = {
    today: moment().toDate(),
    yesterday: moment()
        .subtract(1, 'day')
        .endOf('day')
        .toDate(),
    tomorrow: moment()
        .add(1, 'day')
        .startOf('day')
        .toDate(),
    oneYearInPast: moment()
        .startOf('day')
        .subtract(1, 'year')
        .toDate(),
    oneYearInFuture: moment()
        .endOf('day')
        .add(1, 'year')
        .toDate()
};

describe('utenlandsoppholdFormValidation', () => {
    describe('validateFromDate', () => {
        it('it should return error when date is undefined', () => {
            expect(validateFromDate(undefined, {})).toBeDefined();
        });
        it('it should return error when date is before one year ago', () => {
            expect(
                validateFromDate(
                    moment(dates.oneYearInPast)
                        .subtract(1, 'day')
                        .toDate(),
                    {}
                )
            ).toBeDefined();
        });
        it('it should return error when date is after today', () => {
            expect(
                validateFromDate(
                    moment(dates.today)
                        .add(1, 'day')
                        .toDate(),
                    {}
                )
            ).toBeDefined();
        });
        it('it should return undefined when date is within the last year', () => {
            expect(validateFromDate(moment(dates.oneYearInPast).toDate(), {})).toBeUndefined();
            expect(validateFromDate(dates.today, {})).toBeUndefined();
        });
        it('it should return error when date is after toDate', () => {
            const fromDate = moment()
                .subtract(2, 'weeks')
                .toDate();
            const toDate = moment(fromDate)
                .subtract(1, 'day')
                .toDate();
            expect(validateFromDate(fromDate, { toDate })).toBeDefined();
        });
    });
    describe('validateToDate', () => {
        it('it should return error when date is undefined', () => {
            expect(validateToDate(undefined, {})).toBeDefined();
        });
        it('it should return error when date is after one year in the future', () => {
            expect(
                validateToDate(
                    moment(dates.oneYearInFuture)
                        .add(1, 'day')
                        .toDate(),
                    {}
                )
            ).toBeDefined();
        });
        it('it should return error when date is before today', () => {
            expect(
                validateToDate(
                    moment(dates.today)
                        .subtract(1, 'day')
                        .toDate(),
                    {}
                )
            ).toBeDefined();
        });
        it('it should return undefined when date is within the next year', () => {
            expect(validateToDate(moment(dates.oneYearInFuture).toDate(), {})).toBeUndefined();
            expect(validateToDate(dates.today, {})).toBeUndefined();
        });
        it('it should return error when date is before fromDate', () => {
            const fromDate = moment()
                .subtract(2, 'weeks')
                .toDate();
            const toDate = moment(fromDate)
                .subtract(1, 'day')
                .toDate();
            expect(validateToDate(fromDate, { toDate })).toBeDefined();
        });
    });
});
