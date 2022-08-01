import * as React from 'react';
import { initialValues, SoknadFormData } from '../types/SoknadFormData';
import SoknadRoutes from './SoknadRoutes';
import { SoknadTempStorageData } from 'app/types/SoknadTempStorageData';
import { Barn } from '../types/Barn';
import { Person } from '../types/Person';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { initialSendSoknadState, SendSoknadStatus, SoknadContextProvider } from './SoknadContext';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import soknadTempStorage, { isStorageDataValid } from './SoknadTempStorage';
import RouteConfig, { getRouteUrl } from '../config/routeConfig';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToKvitteringPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { ulid } from 'ulid';
import { getSoknadStepsConfig, StepID } from './soknadStepsConfig';
import { SKJEMANAVN } from '../App';
import { SoknadApplicationType } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { SoknadApiData } from '../types/SoknadApiData';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import { sendSoknad } from '../api/sendSoknad';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import SoknadFormComponents from './SoknadFormComponents';
import { useFormikContext } from 'formik';
interface Props {
    søker: Person;
    barn: Barn[];
    soknadTempStorage: SoknadTempStorageData;
    route?: string;
}

const Soknad = ({ søker, barn, soknadTempStorage: tempStorage }: Props) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);
    const { resetForm } = useFormikContext<SoknadFormData>();
    const [initialFormData, setInitialFormData] = useState<Partial<SoknadFormData>>({ ...initialValues });
    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [soknadId, setSoknadId] = useState<string | undefined>();

    const { logSoknadSent, logSoknadStartet, logSoknadFailed, logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const resetSoknad = async (redirectToFrontpage = true) => {
        await soknadTempStorage.purge();
        setInitialFormData({ ...initialValues });
        setSoknadId(undefined);
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(RouteConfig.SØKNAD_ROUTE_PREFIX)) {
                relocateToSoknad();
                setInitializing(false);
            } else {
                setInitializing(false);
            }
        } else {
            setInitializing(false);
        }
    };

    const abortSoknad = async () => {
        await soknadTempStorage.purge();
        await logHendelse(ApplikasjonHendelse.avbryt);
        relocateToSoknad();
    };

    const startSoknad = async () => {
        await resetSoknad();
        const sId = ulid();
        setSoknadId(sId);
        const firstStep = StepID.OPPLYSNINGER_OM_BARNET;

        await soknadTempStorage.create();
        await logSoknadStartet(SKJEMANAVN);

        setTimeout(() => {
            navigateTo(soknadStepUtils.getStepRoute(firstStep, SoknadApplicationType.SOKNAD), history);
        });
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SoknadFormData) => {
        await soknadTempStorage.update(sId, values, stepID, { søker, barn });
        await logHendelse(ApplikasjonHendelse.fortsettSenere);
        relocateToNavFrontpage();
    };

    const onSoknadSent = async (apiValues: SoknadApiData) => {
        await soknadTempStorage.purge();
        await logSoknadSent(SKJEMANAVN);
        setSendSoknadStatus({ failures: 0, status: success(apiValues) });
        setSoknadId(undefined);
        resetForm();
        navigateToKvitteringPage(history);
    };

    const send = async (apiValues: SoknadApiData) => {
        try {
            await sendSoknad(apiValues);
            onSoknadSent(apiValues);
        } catch (error) {
            if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved innsending av søknad');
                relocateToLoginPage();
            } else {
                await logSoknadFailed('Ved innsending av søknad');
                if (sendSoknadStatus.failures >= 2) {
                    navigateToErrorPage(history);
                } else {
                    setSendSoknadStatus({
                        failures: sendSoknadStatus.failures + 1,
                        status: failure(error),
                    });
                }
            }
        }
    };

    const triggerSend = (apiValues: SoknadApiData) => {
        setTimeout(() => {
            setSendSoknadStatus({ ...sendSoknadStatus, status: pending });
            setTimeout(() => {
                send(apiValues);
            });
        });
    };

    useEffect(() => {
        if (isStorageDataValid(tempStorage, { søker, barn })) {
            setInitialFormData(tempStorage.formData);
            setSoknadId(tempStorage.metadata.soknadId);
            const currentRoute = history.location.pathname;
            const lastStepRoute = soknadStepUtils.getStepRoute(
                tempStorage.metadata.lastStepID,
                SoknadApplicationType.SOKNAD
            );
            if (currentRoute !== lastStepRoute) {
                setTimeout(() => {
                    navigateTo(
                        soknadStepUtils.getStepRoute(tempStorage.metadata.lastStepID, SoknadApplicationType.SOKNAD),
                        history
                    );
                    setInitializing(false);
                });
            } else {
                setInitializing(false);
            }
        } else {
            resetSoknad(history.location.pathname !== RouteConfig.SØKNAD_ROUTE_PREFIX);
        }
    }, [history, tempStorage, søker, barn]);

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={() => {
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialFormData}
                        onSubmit={() => null}
                        renderForm={({ values }) => {
                            const navigateToNextStepFromStep = async (stepID: StepID) => {
                                const soknadStepsConfig = getSoknadStepsConfig(values);
                                const stepToPersist = soknadStepsConfig[stepID].nextStep;
                                if (stepToPersist && soknadId) {
                                    try {
                                        await soknadTempStorage.update(soknadId, values, stepToPersist, {
                                            søker,
                                            barn,
                                        });
                                    } catch (error) {
                                        if (isUserLoggedOut(error)) {
                                            await logUserLoggedOut('ved mellomlagring');
                                            relocateToLoginPage();
                                        }
                                    }
                                }
                                const step = soknadStepsConfig[stepID];
                                setTimeout(() => {
                                    if (step.nextStepRoute) {
                                        navigateTo(step.nextStepRoute, history);
                                    }
                                });
                            };
                            return (
                                <SoknadContextProvider
                                    value={{
                                        soknadId,
                                        soknadStepsConfig: getSoknadStepsConfig(values),
                                        sendSoknadStatus,
                                        resetSoknad: abortSoknad,
                                        continueSoknadLater: soknadId
                                            ? (stepId) => continueSoknadLater(soknadId, stepId, values)
                                            : undefined,
                                        startSoknad,
                                        sendSoknad: triggerSend,
                                        gotoNextStepFromStep: (stepID: StepID) => {
                                            navigateToNextStepFromStep(stepID);
                                        },
                                    }}>
                                    <SoknadRoutes soknadId={soknadId} søker={søker} barn={barn} />
                                </SoknadContextProvider>
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default Soknad;
