import FormikCheckboxPanelGroup from '../../formik/formik-checkbox-panel-group/FormikCheckboxPanelGroup';
import { Field } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikCheckboxPanelGroup<Field>());
