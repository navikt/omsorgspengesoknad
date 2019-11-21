import FormikCheckbox from '../../formik/formik-checkbox/FormikCheckbox';
import { Field } from '../../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikCheckbox<Field>());
