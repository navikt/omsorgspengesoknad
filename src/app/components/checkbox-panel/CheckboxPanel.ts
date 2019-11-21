import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikCheckboxPanel from '../formik/formik-checkbox-panel/FormikCheckboxPanel';

export default injectIntl(FormikCheckboxPanel<Field>());
