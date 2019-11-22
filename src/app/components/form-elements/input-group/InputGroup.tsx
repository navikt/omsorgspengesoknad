import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikInputGroup from './FormikInputGroup';

export default injectIntl(FormikInputGroup<AppFormField>());
