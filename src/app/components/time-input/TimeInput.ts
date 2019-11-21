import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikTimeInput from '../formik/formik-time-input/FormikTimeInput';

export default injectIntl(FormikTimeInput<Field>());
