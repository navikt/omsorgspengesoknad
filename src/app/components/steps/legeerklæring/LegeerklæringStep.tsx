import * as React from 'react';
import { injectIntl, InjectedIntlProps, FormattedHTMLMessage } from 'react-intl';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../../common/types/History';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-attachment-list/LegeerklæringAttachmentList';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import { AppFormField } from '../../../types/OmsorgspengesøknadFormData';
import FileUploadErrors from '../../file-upload-errors/FileUploadErrors';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import HelperTextPanel from '../../../../common/components/helper-text-panel/HelperTextPanel';
import Box from '../../../../common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { CommonStepFormikProps } from '../../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import { CustomFormikProps } from '../../../types/FormikProps';

type Props = { formikProps: CustomFormikProps } & CommonStepFormikProps &
    HistoryProps &
    InjectedIntlProps &
    StepConfigProps;

const LegeerklæringStep = ({ history, intl, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);

    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const isRunningDemoMode = appIsRunningInDemoMode();

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={navigate}
            history={history}
            useValidationErrorSummary={false}
            skipValidation={isRunningDemoMode}
            {...stepProps}>
            {isRunningDemoMode && (
                <Box>
                    <AlertStripeInfo>
                        Opplasting av legeerklæring er ikke tilgjengelig i demo versjon. Du kan klikke Fortsett.
                    </AlertStripeInfo>
                </Box>
            )}
            {false === isRunningDemoMode && (
                <>
                    {/* <Box padBottom="xl">
                        <CounsellorPanel>
                            <p>
                                <FormattedHTMLMessage id="steg.lege.intro.1.html" />
                            </p>
                            <p>
                                <FormattedHTMLMessage id="steg.lege.intro.2.html" />
                            </p>
                        </CounsellorPanel>
                    </Box> */}
                    <HelperTextPanel>
                        <FormattedHTMLMessage id="steg.lege.info.html" />
                    </HelperTextPanel>
                    <Box margin="l">
                        <FormikFileUploader
                            name={AppFormField.legeerklæring}
                            label={intlHelper(intl, 'steg.lege.vedlegg')}
                            onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                            onFileInputClick={() => {
                                setFilesThatDidntGetUploaded([]);
                            }}
                            validate={validateLegeerklæring}
                            onUnauthorizedOrForbiddenUpload={navigateToLoginPage}
                        />
                    </Box>
                    <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
                    <LegeerklæringFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
                </>
            )}
        </FormikStep>
    );
};

export default injectIntl(LegeerklæringStep);
