import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikSelect from '../../formik/formik-select/FormikSelect';

export default injectIntl(FormikSelect<AppFormField>());
