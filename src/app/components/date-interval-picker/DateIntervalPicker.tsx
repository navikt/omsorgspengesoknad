import * as React from 'react';
import { Fieldset } from 'nav-frontend-skjema';
import { FormikDatepickerProps } from '../formik/formik-datepicker/FormikDatepicker';
import { AppFormField } from '../../types/OmsorgspengesøknadFormData';
import Datepicker from '../form-elements/datepicker/Datepicker';
import bemHelper from '../../../common/utils/bemUtils';
import './dateIntervalPicker.less';
import HelperTextButton from '../../../common/components/helper-text-button/HelperTextButton';
import HelperTextPanel from '../../../common/components/helper-text-panel/HelperTextPanel';

interface DateIntervalPickerProps {
    legend: string;
    fromDatepickerProps: FormikDatepickerProps<AppFormField>;
    toDatepickerProps: FormikDatepickerProps<AppFormField>;
    helperText?: string;
}

const bem = bemHelper('dateIntervalPicker');
const DateIntervalPicker: React.FunctionComponent<DateIntervalPickerProps> = ({
    legend,
    fromDatepickerProps,
    toDatepickerProps,
    helperText
}) => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const legendContent = helperText ? (
        <>
            {legend}
            <HelperTextButton
                onClick={() => setShowHelperText(!showHelperText)}
                ariaLabel={legend}
                ariaPressed={showHelperText}
            />
            {showHelperText && <HelperTextPanel>{helperText}</HelperTextPanel>}
        </>
    ) : (
        legend
    );

    return (
        <Fieldset legend={legendContent} className={bem.block}>
            <div className={bem.element('flexContainer')}>
                <Datepicker {...fromDatepickerProps} />
                <Datepicker {...toDatepickerProps} />
            </div>
        </Fieldset>
    );
};

export default DateIntervalPicker;
