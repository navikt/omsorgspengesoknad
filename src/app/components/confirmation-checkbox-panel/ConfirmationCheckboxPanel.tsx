import FormikConfirmationCheckboxPanel from '../formik/formik-confirmation-checkbox-panel/FormikConfirmationCheckboxPanel';
import { Field } from '../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikConfirmationCheckboxPanel<Field>());
