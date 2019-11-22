import FormikFileInput from '../formik-file-input/FormikFileInput';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikFileInput<AppFormField>());
