import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField, Arbeidssituasjon } from '../../../types/OmsorgspengesøknadFormData';
import { validateArbeid } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import CheckboxPanelGroup from '../../form-elements/checkbox-panel-group/CheckboxPanelGroup';

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const ArbeidStep: React.FunctionComponent<Props> = ({ history, intl, nextStepRoute, ...stepProps }) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    return (
        <FormikStep id={StepID.ARBEID} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <CheckboxPanelGroup
                legend={intlHelper(intl, 'steg.arbeid.spm')}
                name={AppFormField.arbeidssituasjon}
                checkboxes={[
                    {
                        label: intlHelper(intl, 'steg.arbeid.arbeidstaker'),
                        value: Arbeidssituasjon.arbeidstaker,
                        key: Arbeidssituasjon.arbeidstaker
                    },
                    {
                        label: intlHelper(intl, 'steg.arbeid.selvstendigNæringsdrivende'),
                        value: Arbeidssituasjon.selvstendigNæringsdrivende,
                        key: Arbeidssituasjon.selvstendigNæringsdrivende
                    },
                    {
                        label: intlHelper(intl, 'steg.arbeid.frilanser'),
                        value: Arbeidssituasjon.frilanser,
                        key: Arbeidssituasjon.frilanser
                    }
                ]}
                validate={validateArbeid}
            />
        </FormikStep>
    );
};

export default injectIntl(ArbeidStep);
