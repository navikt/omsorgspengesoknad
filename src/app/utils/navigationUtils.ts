import { History } from 'history';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';
import { StepID } from '../config/stepConfig';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToLoginPage = () => window.location.assign(loginUrl);
export const userIsCurrentlyOnErrorPage = () => window.location.pathname === getRouteUrl(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToSoknadStep = (step: StepID, history: History): void => history.push(`${step}`);
