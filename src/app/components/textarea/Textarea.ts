import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikTextarea from '../formik/formik-textarea/FormikTextarea';

export default injectIntl(FormikTextarea<Field>());
