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
                        <p>
                            Denne søknaden kan <strong>kun</strong> brukes til å søke om ekstra omsorgsdager for barn
                            med kronisk sykdom eller funksjonshemning.
                        </p>
                        <p>
                            Du må foreløpig{' '}
                            <Lenke href={getLenker(intl.locale).papirskjemaPrivat} target="_blank">
                                sende skjema i posten
                            </Lenke>{' '}
                            hvis du skal
                            <ol>
                                <li>dele omsorgsdager med en annen omsorgsperson</li>
                                <li>
                                    søke om å bli regnet som alene om omsorgen fordi den andre forelderen ikke kan ha
                                    tilsyn med barnet i en periode på minst 6 måneder
                                </li>
                            </ol>
                        </p>
                        <div>
                            Hvis du skal overføre dager til en annen omsorgsperson pga. stengt barnehage eller skole i
                            forbindelse med koronaviruset{' '}
                            <Lenke
                                href="https://www.nav.no/familie/sykdom-i-familien/soknad/overfore-omsorgsdager"
                                target="_blank">
                                gjør du det her
                            </Lenke>
                            .
                        </div>
                    </CounsellorPanel>
                )}
                {formValues.kroniskEllerFunksjonshemming === YesOrNo.YES && (
                    <>
                        <CounsellorPanel>
                            <p>
                                For å søke om ekstra omsorgsdager må du ha legeerklæring for barnet. Hvis du ikke har
                                legeerklæringen tilgjengelig nå, kan du ettersende den.
                            </p>
                            <p>
                                Hvis du ikke bor på samme folkeregistrerte adresse som barnet, men har en avtale om delt
                                bosted, må du laste opp avtalen.
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
