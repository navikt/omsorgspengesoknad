import FormikInput from '../formik/formik-input/FormikInput';
import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikInput<Field>());
