import FormikRadioPanelGroup from '../../formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikRadioPanelGroup<AppFormField>());
