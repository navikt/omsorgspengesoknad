import { History } from 'history';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';
import { StepID } from '../config/stepConfig';

const loginUrl = getEnvironmentVariable('LOGIN_URL');
const navNoUrl = 'https://www.nav.no/';
const welcomePageUrl = `${getEnvironmentVariable('PUBLIC_PATH')}${routeConfig.WELCOMING_PAGE_ROUTE}`;

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToLoginPage = () => window.location.assign(loginUrl);
export const userIsCurrentlyOnErrorPage = () => window.location.pathname === getRouteUrl(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToSoknadStep = (step: StepID, history: History): void => history.push(`${step}`);
export const navigateToWelcomePage = () => window.location.assign(welcomePageUrl);
export const userIsOnStep = (stepID: StepID, history: History) => history.location.pathname.indexOf(`/${stepID}`) >= 0;
export const navigateToNAVno = () => window.location.assign(navNoUrl);
