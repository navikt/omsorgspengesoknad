import * as React from 'react';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getBarn, getSøker } from '../../api/api';
import routeConfig, { getRouteUrl } from '../../config/routeConfig';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import { Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '../../utils/apiUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import LoadingPage from '../pages/loading-page/LoadingPage';
import appSentryLogger from '../../utils/appSentryLogger';

interface Props {
    contentLoadedRenderer: (søkerdata?: Søkerdata) => React.ReactNode;
}

interface State {
    doApiCalls: boolean;
    isLoading: boolean;
    søkerdata?: Søkerdata;
}

const AppEssentialsLoader = (props: Props) => {
    const [state, setState] = useState<State>({ doApiCalls: true, isLoading: true });

    async function loadAppEssentials() {
        try {
            const [søkerResponse, barnResponse] = await Promise.all([getSøker(), getBarn()]);
            setState({
                ...state,
                søkerdata: {
                    person: søkerResponse.data,
                    barn: barnResponse.data.barn
                },
                isLoading: false,
                doApiCalls: false
            });
        } catch (error) {
            handleSøkerdataFetchError(error);
        }
    }

    function handleSøkerdataFetchError(response: AxiosError) {
        if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
            navigateToLoginPage();
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
    const { isLoading, søkerdata } = state;

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <>
            <SøkerdataContextProvider value={søkerdata}>{contentLoadedRenderer(søkerdata)}</SøkerdataContextProvider>
        </>
    );
};

export default AppEssentialsLoader;
