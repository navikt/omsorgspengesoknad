import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from '@navikt/sif-common/lib/common/components/counsellor-panel/CounsellorPanel';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common/lib/common/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import {
    validateYesOrNoIsAnswered
} from '@navikt/sif-common/lib/common/validation/fieldValidations';
import FormBlock from 'common/components/form-block/FormBlock';
import bemHelper from 'common/utils/bemUtils';
import getLenker from '../../../lenker';
import {
    AppFormField, OmsorgspengesøknadFormData
} from '../../../types/OmsorgspengesøknadFormData';

interface Props {
    onConfirm: () => void;
    onOpenDinePlikterModal: () => void;
    openBehandlingAvPersonopplysningerModal: () => void;
}

const AppForm = getTypedFormComponents<AppFormField, OmsorgspengesøknadFormData>();

const bem = bemHelper('welcomingPage');

const SamtykkeForm: React.FunctionComponent<Props> = ({
    onConfirm,
    onOpenDinePlikterModal,
    openBehandlingAvPersonopplysningerModal
}) => {
    const { values: formValues } = useFormikContext<OmsorgspengesøknadFormData>();
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            <FormBlock>
                <AppForm.YesOrNoQuestion
                    name={AppFormField.kroniskEllerFunksjonshemming}
                    legend={intlHelper(intl, 'introPage.spm.kroniskEllerFunksjonshemmende')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                {formValues.kroniskEllerFunksjonshemming === YesOrNo.NO && (
                    <CounsellorPanel>
                        <FormattedHTMLMessage
                            id={`introPage.infoIkkeKroniskEllerFunksjonshemmende.html`}
                            values={{ url: getLenker(intl.locale).papirskjemaPrivat }}
                        />
                    </CounsellorPanel>
                )}
                {formValues.kroniskEllerFunksjonshemming === YesOrNo.YES && (
                    <>
                        <CounsellorPanel>
                            <FormattedHTMLMessage id={`introPage.legeerklæring.html`} />
                        </CounsellorPanel>
                        <FormBlock>
                            <AppForm.ConfirmationCheckbox
                                label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                                name={AppFormField.harForståttRettigheterOgPlikter}
                                validate={(value) => {
                                    let result;
                                    if (value !== true) {
                                        result = intlHelper(intl, 'welcomingPage.samtykke.harIkkeGodkjentVilkår');
                                    }
                                    return result;
                                }}>
                                <FormattedMessage
                                    id="welcomingPage.samtykke.harForståttLabel"
                                    values={{
                                        plikterLink: (
                                            <Lenke href="#" onClick={onOpenDinePlikterModal}>
                                                {intlHelper(intl, 'welcomingPage.samtykke.harForståttLabel.lenketekst')}
                                            </Lenke>
                                        )
                                    }}
                                />
                            </AppForm.ConfirmationCheckbox>
                        </FormBlock>
                        <FormBlock>
                            <Hovedknapp className={bem.element('startApplicationButton')}>
                                {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                            </Hovedknapp>
                        </FormBlock>
                        <FormBlock>
                            <div className={bem.element('personopplysningModalLenke')}>
                                <Lenke href="#" onClick={openBehandlingAvPersonopplysningerModal}>
                                    <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                                </Lenke>
                            </div>
                        </FormBlock>
                    </>
                )}
            </FormBlock>
        </AppForm.Form>
    );
};
export default SamtykkeForm;
