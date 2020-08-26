import { Attachment } from 'common/types/Attachment';
import { AppFormField, OmsorgspengesøknadFormData } from '../types/OmsorgspengesøknadFormData';

export const valuesToAlleDokumenterISøknaden = (values: OmsorgspengesøknadFormData): Attachment[] => {
    const samværsavtaleDokumenter: Attachment[] = values.samværsavtale ? values.samværsavtale : [];
    return [
        ...values[AppFormField.legeerklæring],
        ...samværsavtaleDokumenter
    ];
};
