import FormikDatepicker from '../../formik/formik-datepicker/FormikDatepicker';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikDatepicker<AppFormField>());
