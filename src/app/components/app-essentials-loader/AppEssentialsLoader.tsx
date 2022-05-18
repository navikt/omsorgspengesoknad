import * as React from 'react';
import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getSøker } from '../../api/api';
import routeConfig, { getRouteUrl } from '../../config/routeConfig';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import LoadingPage from '../pages/loading-page/LoadingPage';
import appSentryLogger from '../../utils/appSentryLogger';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import { AppFormField, initialValues, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { StepID } from '../../config/stepConfig';
import { MELLOMLAGRING_VERSION, SoknadTempStorageData } from '../../types/SoknadTempStorageData';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

export const VERIFY_MELLOMLAGRING_VERSION = true;

interface Props {
    contentLoadedRenderer: (
        formData: OmsorgspengesøknadFormData,
        søkerdata: Søkerdata,
        lastStepID: StepID | undefined
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    formData: OmsorgspengesøknadFormData;
    søkerdata?: Søkerdata;
    lastStepID?: StepID;
    hasNoAccess?: boolean;
}

const initialState: State = {
    isLoading: true,
    formData: initialValues,
    lastStepID: undefined,
};

const getValidAttachments = (attachments: Attachment[] = []): Attachment[] => {
    return attachments.filter((a) => {
        return a.file?.name !== undefined;
    });
};

const AppEssentialsLoader: React.FC<Props> = (props) => {
    const [state, setState] = useState<State>(initialState);
    const [apiCallError, setApiCallError] = useState<boolean>(false);
    const { contentLoadedRenderer } = props;
    const { isLoading, søkerdata, formData, lastStepID } = state;
    const [doApiCalls, setDoApiCalls] = useState<boolean>(true);

    const getValidMellomlagring = (data?: SoknadTempStorageData): SoknadTempStorageData | undefined => {
        if (VERIFY_MELLOMLAGRING_VERSION) {
            if (
                data?.metadata?.version === MELLOMLAGRING_VERSION &&
                data?.formData?.harForståttRettigheterOgPlikter === true
            ) {
                return data;
            }
            return undefined;
        }
        return data;
    };

    const handleSøkerdataFetchSuccess = (
        søkerResponse: AxiosResponse,
        barnResponse?: AxiosResponse,
        tempStorageResponse: AxiosResponse
    ) => {
        const mellomlagring = getValidMellomlagring(tempStorageResponse?.data);
        const formData = mellomlagring?.formData
            ? {
                  ...mellomlagring.formData,
                  [AppFormField.legeerklæring]: getValidAttachments(mellomlagring.formData.legeerklæring),
                  [AppFormField.samværsavtale]: getValidAttachments(mellomlagring.formData.samværsavtale),
              }
            : undefined;

        const lastStepID = mellomlagring?.metadata?.lastStepID;

        const updatedSokerData: Søkerdata | undefined = isSøkerApiResponse(søkerResponse.data)
            ? {
                  søkerdata: {
                    person:søkerResponse.data,
                    
                  }
              }
            : undefined;

        setState({
            isLoading: false,
            lastStepID: isSøknadFormData(søknadFormData) ? maybeStoredLastStepID : undefined,
            formData: isSøknadFormData(søknadFormData) ? søknadFormData : { ...initialValues },
            søkerdata: updatedSokerData,
        });
        if (!isSøkerApiResponse(søkerResponse.data)) {
            setApiCallError(true);
            appSentryLogger.logError('søkerApiResponse invalid (SøknadEssentialsLoader)');
        }
    };

    async function loadAppEssentials() {
        try {
            const [søkerResponse, barnResponse] = await Promise.all([getSøker(), getBarn()]);
            setState({
                ...state,
                søkerdata: {
                    person: søkerResponse.data,
                    barn: barnResponse.data.barn,
                },
                isLoading: false,
                doApiCalls: false,
            });
        } catch (error) {
            handleSøkerdataFetchError(error);
        }
    }

    function handleSøkerdataFetchError(response: AxiosError) {
        if (apiUtils.isUnauthorized(response)) {
            navigateToLoginPage();
        } else if (apiUtils.isForbidden(response)) {
            setState({ ...state, hasNoAccess: true, isLoading: false, doApiCalls: false });
            return;
        } else if (!userIsCurrentlyOnErrorPage()) {
            appSentryLogger.logApiError(response);
            window.location.assign(getRouteUrl(routeConfig.ERROR_PAGE_ROUTE));
        }
        setState({ ...state, doApiCalls: false });
    }

    useEffect(() => {
        if (state.doApiCalls === true) {
            loadAppEssentials();
        }
    });

    const { contentLoadedRenderer } = props;
    const { isLoading, formdata, søkerdata, hasNoAccess } = state;

    if (isLoading) {
        return <LoadingPage />;
    }

    if (hasNoAccess) {
        return <IkkeTilgangPage />;
    }

    return (
        <>
            <SøkerdataContextProvider value={søkerdata}>
                {contentLoadedRenderer(formdata, søkerdata)}
            </SøkerdataContextProvider>
        </>
    );
};

export default AppEssentialsLoader;
