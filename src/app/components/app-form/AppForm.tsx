import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { AppFormField, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';

const AppForm = getTypedFormComponents<AppFormField, OmsorgspengesøknadFormData, ValidationError>();

export default AppForm;
