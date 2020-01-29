import axios, { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';
import { ResourceType } from '../types/ResourceType';
import { getEnvironmentVariable } from './envUtils';
import Cookie from 'js-cookie';

const getSelvbetjeningIdToken = () => {
    return Cookie.get('selvbetjening-idtoken');
};

const getAuthorizationHeader = () => {
    const token = getSelvbetjeningIdToken();
    return token
        ? {
              Authorization: `Bearer ${token}`
          }
        : {};
};

export const getAxiosConfig = () => {
    return {
        withCredentials: true,
        headers: {
            ...getAuthorizationHeader()
        }
    };
};
export const getAxiosMultipartConfig = (multipart?: boolean) => {
    const config = getAxiosConfig();
    config.headers = {
        ...config.headers,
        ...{ 'Content-Type': 'multipart/form-data' }
    };
    return config;
};

export const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, getAxiosMultipartConfig());
};

export const isForbidden = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.UNAUTHORIZED;

export const getApiUrlByResourceType = (resourceType: ResourceType) => {
    return `${getEnvironmentVariable('API_URL')}/${resourceType}`;
};
