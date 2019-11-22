import FormikInput from '../../formik/formik-input/FormikInput';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikInput<AppFormField>());
