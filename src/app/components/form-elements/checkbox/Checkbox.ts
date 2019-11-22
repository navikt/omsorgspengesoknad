import FormikCheckbox from '../../formik/formik-checkbox/FormikCheckbox';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikCheckbox<AppFormField>());
