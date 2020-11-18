import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormBlock from 'common/components/form-block/FormBlock';
import bemHelper from 'common/utils/bemUtils';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import intlHelper from 'common/utils/intlUtils';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import getLenker from '../../../lenker';
import { AppFormField, OmsorgspengesøknadFormData } from '../../../types/OmsorgspengesøknadFormData';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';

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
}: Props) => {
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
                        <p>
                            <FormattedHtmlMessage id="welcomingPage.veileder.1.html" />
                        </p>
                        <div>
                            <FormattedHtmlMessage id="welcomingPage.veileder.2.1" />{' '}
                            <Lenke href={getLenker(intl.locale).papirskjemaPrivat} target="_blank">
                                <FormattedHtmlMessage id="welcomingPage.veileder.2.2" />
                            </Lenke>{' '}
                            <FormattedHtmlMessage id="welcomingPage.veileder.2.3" />
                            <ol>
                                <li>
                                    <FormattedHtmlMessage id="welcomingPage.veileder.2.4.1" />
                                </li>
                                <li>
                                    <FormattedHtmlMessage id="welcomingPage.veileder.2.4.2" />
                                </li>
                            </ol>
                        </div>
                        <div>
                            <FormattedHtmlMessage id="welcomingPage.veileder.3.1" />{' '}
                            <Lenke
                                href="https://www.nav.no/familie/sykdom-i-familien/soknad/overfore-omsorgsdager"
                                target="_blank">
                                <FormattedHtmlMessage id="welcomingPage.veileder.3.2" />
                            </Lenke>
                            <FormattedHtmlMessage id="welcomingPage.veileder.3.3" />
                        </div>
                    </CounsellorPanel>
                )}
                {formValues.kroniskEllerFunksjonshemming === YesOrNo.YES && (
                    <>
                        <CounsellorPanel>
                            <p>
                                <FormattedHtmlMessage id="welcomingPage.kronisk.1" />
                            </p>
                            <p>
                                <FormattedHtmlMessage id="welcomingPage.kronisk.2" />
                            </p>
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
                            <div className={bem.element('buttonWrapper')}>
                                <Hovedknapp className={bem.element('startApplicationButton')}>
                                    {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                                </Hovedknapp>
                            </div>
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
