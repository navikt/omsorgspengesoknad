import moment from 'moment';

const apiDateFormat = 'YYYY-MM-DD';
const prettyDateFormat = 'DD.MM.YYYY';

export const formatDate = (date: Date) => moment(date).format(apiDateFormat);
export const prettifyDate = (date: Date) => moment(date).format(prettyDateFormat);

export const date3YearsAgo = moment()
    .subtract(3, 'years')
    .startOf('day');

export const isMoreThan3YearsAgo = (date: Date) => moment(date).isBefore(date3YearsAgo);

export const dateToISOFormattedDateString = (date?: Date) =>
    date ? moment.utc(date).format(apiDateFormat) : undefined;

export const date1YearAgo = moment()
    .subtract(1, 'years')
    .startOf('day')
    .toDate();

export const date1YearFromNow = moment()
    .add(1, 'years')
    .endOf('day')
    .toDate();

export const dateToday = moment().toDate();
