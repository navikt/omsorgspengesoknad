import FormikCheckboxPanelGroup from '../../formik/formik-checkbox-panel-group/FormikCheckboxPanelGroup';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikCheckboxPanelGroup<AppFormField>());
