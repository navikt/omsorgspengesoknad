import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikTextarea from '../../formik/formik-textarea/FormikTextarea';

export default injectIntl(FormikTextarea<AppFormField>());
