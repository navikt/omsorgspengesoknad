import FormikCheckboxPanelGroup from '../../formik/formik-checkbox-panel-group/FormikCheckboxPanelGroup';
import { Field } from '../../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikCheckboxPanelGroup<Field>());
