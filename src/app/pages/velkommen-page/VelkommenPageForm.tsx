import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { SoknadFormField } from '../../types/SoknadFormData';
import InfoList from './components/info-list/InfoList';
import { Undertittel } from 'nav-frontend-typografi';
import getLenker from '../../lenker';

interface Props {
    onStart: () => void;
}

const VelkommenPageForm = ({ onStart }: Props) => {
    const intl = useIntl();

    return (
        <SoknadFormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            formErrorHandler={intlFormErrorHandler(intl, 'validation')}>
            <FormBlock>
                <div data-testid={'welcomingPage-harForståttRettigheterOgPlikter'}>
                    <SoknadFormComponents.ConfirmationCheckbox
                        label={intlHelper(intl, 'page.velkommen.form.bekreftLabel')}
                        name={SoknadFormField.harForståttRettigheterOgPlikter}
                        validate={getCheckedValidator()}>
                        <Undertittel tag="h2">
                            <strong>
                                <FormattedMessage id="page.velkommen.form.ansvar.tittel" />
                            </strong>
                        </Undertittel>
                        <InfoList>
                            <li>
                                <FormattedMessage id="page.velkommen.form.ansvar.list.1" />
                            </li>
                            <li>
                                <FormattedMessage id="page.velkommen.form.ansvar.list.2.1" />{' '}
                                <Lenke href={getLenker(intl.locale).rettOgPlikt} target="_blank">
                                    <FormattedMessage id="page.velkommen.form.ansvar.list.2.2" />
                                </Lenke>
                            </li>
                        </InfoList>
                    </SoknadFormComponents.ConfirmationCheckbox>
                </div>
            </FormBlock>
            <FormBlock>
                <div data-testid={'welcomingPage-begynnsøknad'} style={{ textAlign: 'center' }}>
                    <Hovedknapp>{intlHelper(intl, 'welcomingPage.begynnsøknad')}</Hovedknapp>
                </div>
            </FormBlock>
        </SoknadFormComponents.Form>
    );
};

export default VelkommenPageForm;
