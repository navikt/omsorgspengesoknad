import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import CounsellorPanel from '@navikt/sif-common/lib/common/components/counsellor-panel/CounsellorPanel';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common/lib/common/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import {
    validateYesOrNoIsAnswered
} from '@navikt/sif-common/lib/common/validation/fieldValidations';
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
    const { values: formValues } = useFormikContext();
    const intl = useIntl();
    return (
        <AppForm.Form
            onValidSubmit={onConfirm}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            <Box margin="xl">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.kroniskEllerFunksjonshemming}
                    legend={intlHelper(intl, 'introPage.spm.kroniskEllerFunksjonshemmende')}
                    validate={validateYesOrNoIsAnswered}
                />
            </Box>

            <Box margin="xl">
                {formValues.kroniskEllerFunksjonshemming === YesOrNo.NO && (
                    <CounsellorPanel>
                        <p>
                            <FormattedHTMLMessage
                                id={`introPage.infoIkkeKroniskEllerFunksjonshemmende.html`}
                                values={{ url: getLenker(intl.locale).papirskjemaPrivat }}
                            />
                        </p>
                    </CounsellorPanel>
                )}
                {formValues.kroniskEllerFunksjonshemming === YesOrNo.YES && (
                    <>
                        <CounsellorPanel>
                            <FormattedHTMLMessage id={`introPage.legeerklæring.html`} />
                        </CounsellorPanel>
                        <Box margin="xl">
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
                        </Box>
                        <Box margin="xl">
                            <Hovedknapp className={bem.element('startApplicationButton')}>
                                {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                            </Hovedknapp>
                        </Box>
                        <Box margin="xl" className={bem.element('personopplysningModalLenke')}>
                            <Lenke href="#" onClick={openBehandlingAvPersonopplysningerModal}>
                                <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                            </Lenke>
                        </Box>
                    </>
                )}
            </Box>
        </AppForm.Form>
    );
};
export default SamtykkeForm;
