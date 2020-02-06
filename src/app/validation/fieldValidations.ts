import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { Attachment } from 'common/types/Attachment';
import { YesOrNo } from 'common/types/YesOrNo';
import { attachmentHasBeenUploaded } from 'common/utils/attachmentUtils';
import {
    date1YearAgo, date1YearFromNow, DateRange, dateRangesCollide, dateRangesExceedsRange
} from 'common/utils/dateUtils';
import { FieldValidationResult } from 'common/validation/types';
import { Arbeidssituasjon, SøkersRelasjonTilBarnet } from '../types/OmsorgspengesøknadFormData';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';

export enum FieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fødselsnummer_11siffer' = 'fieldvalidation.fødselsnummer.11siffer',
    'fødselsnummer_ugyldig' = 'fieldvalidation.fødselsnummer.ugyldig',
    'foreløpigFødselsnummer_ugyldig' = 'fieldvalidation.foreløpigFødselsnummer.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'legeerklæring_mangler' = 'fieldvalidation.legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'fieldvalidation.legeerklæring.forMangeFiler',
    'samværsavtale_mangler' = 'fieldvalidation.samværsavtale.mangler',
    'samværsavtale_forMangeFiler' = 'fieldvalidation.samværsavtale.forMangeFiler',
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode'
}

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

const fieldIsRequiredError = () => fieldValidationError(FieldValidationErrors.påkrevd);

export const validateFødselsnummer = (v: string): FieldValidationResult => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            return fieldValidationError(FieldValidationErrors.fødselsnummer_11siffer);
        } else {
            return fieldValidationError(FieldValidationErrors.fødselsnummer_ugyldig);
        }
    }
};

export const validateForeløpigFødselsnummer = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return undefined;
    }

    const elevenDigits = new RegExp('^\\d{11}$');
    if (!elevenDigits.test(v)) {
        return fieldValidationError(FieldValidationErrors.foreløpigFødselsnummer_ugyldig);
    }
    return undefined;
};

export const validateValgtBarn = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateNavn = (v: string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired === true && !hasValue(v)) {
        return fieldIsRequiredError();
    }

    const maxNumOfLetters = 50;
    const nameIsValid = v.length <= maxNumOfLetters;

    return nameIsValid
        ? undefined
        : fieldValidationError(FieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters });
};

export const validateRelasjonTilBarnet = (v?: SøkersRelasjonTilBarnet | string): FieldValidationResult => {
    if (!hasValue(v)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateYesOrNoIsAnswered = (answer: YesOrNo): FieldValidationResult => {
    if (answer === YesOrNo.UNANSWERED || answer === undefined) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateUtenlandsoppholdSiste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_utenfor_periode);
    }

    return undefined;
};

export const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};

export const validateLegeerklæring = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    if (uploadedAttachments.length === 0) {
        return fieldValidationError(FieldValidationErrors.legeerklæring_mangler);
    }
    if (uploadedAttachments.length > 3) {
        return fieldValidationError(FieldValidationErrors.legeerklæring_forMangeFiler);
    }
    return undefined;
};

export const validateSamværsavtale = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    if (uploadedAttachments.length === 0) {
        return fieldValidationError(FieldValidationErrors.samværsavtale_mangler);
    }
    if (uploadedAttachments.length > 3) {
        return fieldValidationError(FieldValidationErrors.samværsavtale_forMangeFiler);
    }
    return undefined;
};

export const validateRequiredField = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateArbeid = (value: Arbeidssituasjon[]): FieldValidationResult => {
    if (value === undefined || value.length === 0) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const fieldValidationError = (key: FieldValidationErrors | undefined, values?: any): FieldValidationResult => {
    return key
        ? {
              key,
              values
          }
        : undefined;
};

export const validateUtenlandsoppholdIPerioden = (
    periode: DateRange,
    utenlandsopphold: Utenlandsopphold[]
): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};
