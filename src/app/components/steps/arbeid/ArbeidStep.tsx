import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField, Arbeidssituasjon } from '../../../types/OmsorgspengesøknadFormData';
import { validateArbeid } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import FormikCheckboxPanelGroup from 'common/formik/formik-checkbox-panel-group/FormikCheckboxPanelGroup';

type Props = CommonStepFormikProps & HistoryProps & StepConfigProps;

const ArbeidStep: React.FunctionComponent<Props> = ({ history, nextStepRoute, ...stepProps }) => {
    const intl = useIntl();
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    return (
        <FormikStep id={StepID.ARBEID} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <FormikCheckboxPanelGroup<AppFormField>
                legend={intlHelper(intl, 'steg.arbeid.spm')}
                name={AppFormField.arbeidssituasjon}
                singleColumn={true}
                checkboxes={[
                    {
                        label: intlHelper(intl, 'arbeidssituasjon.arbeidstaker'),
                        value: Arbeidssituasjon.arbeidstaker,
                        key: Arbeidssituasjon.arbeidstaker
                    },
                    {
                        label: intlHelper(intl, 'arbeidssituasjon.selvstendigNæringsdrivende'),
                        value: Arbeidssituasjon.selvstendigNæringsdrivende,
                        key: Arbeidssituasjon.selvstendigNæringsdrivende
                    },
                    {
                        label: intlHelper(intl, 'arbeidssituasjon.frilanser'),
                        value: Arbeidssituasjon.frilanser,
                        key: Arbeidssituasjon.frilanser
                    }
                ]}
                validate={validateArbeid}
            />
        </FormikStep>
    );
};

// Todo - kommer ikke videre ved første valg

export default ArbeidStep;
