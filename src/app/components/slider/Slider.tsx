import FormikSlider from '../formik/formik-slider/FormikSlider';
import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikSlider<Field>());
