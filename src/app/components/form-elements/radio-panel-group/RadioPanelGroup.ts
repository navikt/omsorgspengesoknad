import FormikRadioPanelGroup from '../../formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { Field } from '../../../types/OmsorgspengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikRadioPanelGroup<Field>());
