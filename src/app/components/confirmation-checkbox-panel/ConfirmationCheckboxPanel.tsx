import FormikConfirmationCheckboxPanel from '../formik/formik-confirmation-checkbox-panel/FormikConfirmationCheckboxPanel';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikConfirmationCheckboxPanel<AppFormField>());
