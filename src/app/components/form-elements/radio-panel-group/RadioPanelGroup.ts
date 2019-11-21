import FormikRadioPanelGroup from '../../formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { Field } from '../../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikRadioPanelGroup<Field>());
