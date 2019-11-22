import { YesOrNo } from '../../common/types/YesOrNo';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';
import { isMoreThan3YearsAgo } from '../../common/utils/dateUtils';
import { attachmentHasBeenUploaded } from '../../common/utils/attachmentUtils';
import { FieldValidationResult } from './types';
import { Attachment } from '../../common/types/Attachment';
import { SøkersRelasjonTilBarnet } from '../types/OmsorgspengesøknadFormData';

const moment = require('moment');

export enum FieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fødselsnummer_11siffer' = 'fieldvalidation.fødselsnummer.11siffer',
    'fødselsnummer_ugyldig' = 'fieldvalidation.fødselsnummer.ugyldig',
    'foreløpigFødselsnummer_ugyldig' = 'fieldvalidation.foreløpigFødselsnummer.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'relasjon_maksAntallTegn' = 'fieldvalidation.relasjon.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'legeerklæring_mangler' = 'fieldvalidation.legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'fieldvalidation.legeerklæring.forMangeFiler'
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

export const validateFradato = (fraDato?: Date, tilDato?: Date): FieldValidationResult => {
    if (!hasValue(fraDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(fraDato!)) {
        return fieldValidationError(FieldValidationErrors.fradato_merEnnTreÅr);
    }

    if (hasValue(tilDato)) {
        if (moment(fraDato).isAfter(tilDato)) {
            return fieldValidationError(FieldValidationErrors.fradato_erEtterTildato);
        }
    }

    return undefined;
};

export const validateTildato = (tilDato?: Date, fraDato?: Date): FieldValidationResult => {
    if (!hasValue(tilDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(tilDato!)) {
        return fieldValidationError(FieldValidationErrors.tildato_merEnnTreÅr);
    }

    if (hasValue(fraDato)) {
        if (moment(tilDato).isBefore(fraDato)) {
            return fieldValidationError(FieldValidationErrors.tildato_erFørFradato);
        }
    }

    return undefined;
};

export const validateYesOrNoIsAnswered = (answer: YesOrNo): FieldValidationResult => {
    if (answer === YesOrNo.UNANSWERED || answer === undefined) {
        return fieldIsRequiredError();
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

export const validateRequiredField = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
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
