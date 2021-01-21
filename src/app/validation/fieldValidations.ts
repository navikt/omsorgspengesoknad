import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import {
    date1YearAgo,
    date1YearFromNow,
    DateRange,
    dateRangesCollide,
    dateRangesExceedsRange,
    dateToday,
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { Arbeidssituasjon, SøkersRelasjonTilBarnet } from '../types/OmsorgspengesøknadFormData';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';

export const fieldValidationError = (
    key: AppFieldValidationErrors | undefined,
    values?: any
): FieldValidationResult => {
    return key
        ? {
              key,
              values,
          }
        : undefined;
};

export enum AppFieldValidationErrors {
    'fødselsdato_ugyldig' = 'fieldvalidation.fødelsdato.ugyldig',
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fødselsnummer_11siffer' = 'fieldvalidation.fødselsnummer.11siffer',
    'fødselsnummer_ugyldig' = 'fieldvalidation.fødselsnummer.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'legeerklæring_mangler' = 'fieldvalidation.legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'fieldvalidation.legeerklæring.forMangeFiler',
    'samværsavtale_mangler' = 'fieldvalidation.samværsavtale.mangler',
    'samværsavtale_forMangeFiler' = 'fieldvalidation.samværsavtale.forMangeFiler',
    'samlet_storrelse_for_hoy' = 'fieldvalidation.samlet_storrelse_for_hoy',
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode',
}

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

const fieldIsRequiredError = () => fieldValidationError(AppFieldValidationErrors.påkrevd);

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | AppFieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | AppFieldValidationErrors>(error, values);
};

export const validateFødselsnummer = (v: string): FieldValidationResult => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            return fieldValidationError(AppFieldValidationErrors.fødselsnummer_11siffer);
        } else {
            return fieldValidationError(AppFieldValidationErrors.fødselsnummer_ugyldig);
        }
    }
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
        : fieldValidationError(AppFieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters });
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
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }

    return undefined;
};

export const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};

export const validerAlleDokumenterISøknaden = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    const totalSizeInBytes: number = getTotalSizeOfAttachments(uploadedAttachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return createAppFieldValidationError(AppFieldValidationErrors.samlet_storrelse_for_hoy);
    }
    if (uploadedAttachments.length > 100) {
        return fieldValidationError(AppFieldValidationErrors.legeerklæring_forMangeFiler);
    }
    return undefined;
};

export const validateSumOfAllAttachmentsAndValidateStep = (
    otherAttachments: Attachment[],
    validationFunc: (attachments: Attachment[]) => FieldValidationResult
): ((attachments: Attachment[]) => FieldValidationResult) => {
    return (attachments: Attachment[]) => {
        return validerAlleDokumenterISøknaden([...attachments, ...otherAttachments]) || validationFunc(attachments);
    };
};

export const validateDeltBostedAvtale = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    if (uploadedAttachments.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.samværsavtale_mangler);
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

export const validateUtenlandsoppholdIPerioden = (
    periode: DateRange,
    utenlandsopphold: Utenlandsopphold[]
): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return fieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};

export const validateFødselsdato = (dateString?: string): FieldValidationResult => {
    const date = datepickerUtils.getDateFromDateString(dateString);
    if (!hasValue(date)) {
        return fieldIsRequiredError();
    }
    if (dayjs(date).isAfter(dateToday)) {
        return createAppFieldValidationError(AppFieldValidationErrors.fødselsdato_ugyldig);
    }
    return undefined;
};
