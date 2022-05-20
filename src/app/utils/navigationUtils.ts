import { StepID } from '../soknad/soknadStepsConfig';
import { History } from 'history';
import { getEnvironmentVariable } from './envUtils';
import RouteConfig, { getRouteUrl } from '../config/routeConfig';

const loginUrl = getEnvironmentVariable('LOGIN_URL');
const navNoUrl = 'https://www.nav.no/';
const welcomePageUrl = `${getEnvironmentVariable('PUBLIC_PATH')}${RouteConfig.SØKNAD_ROUTE_PREFIX}`;
const relocateTo = (url: string) => {
    window.location.assign(url);
};

export const navigateTo = (route: string, history: History) => history.push(route);

export const userIsCurrentlyOnErrorPage = () => window.location.pathname === getRouteUrl(RouteConfig.ERROR_PAGE_ROUTE);
export const navigateToSoknadStep = (step: StepID, history: History): void => history.push(`${step}`);
export const navigateToWelcomePage = () => window.location.assign(welcomePageUrl);
export const userIsOnStep = (stepID: StepID, history: History) => history.location.pathname.indexOf(`/${stepID}`) >= 0;

export const relocateToLoginPage = () => relocateTo(getEnvironmentVariable(loginUrl));
export const relocateToNavFrontpage = () => relocateTo(navNoUrl);
export const relocateToSoknad = () => relocateTo(getRouteUrl(RouteConfig.SØKNAD_ROUTE_PREFIX));
export const navigateToErrorPage = (history: History) => navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
export const navigateToKvitteringPage = (history: History) => navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
