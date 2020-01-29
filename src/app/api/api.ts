import axios from 'axios';
import { OmsorgspengesøknadApiData } from '../types/OmsorgspengesøknadApiData';
import { getApiUrlByResourceType, sendMultipartPostRequest, getAxiosConfig } from '../utils/apiUtils';
import { ResourceType } from '../types/ResourceType';

export const getBarn = () => axios.get(getApiUrlByResourceType(ResourceType.BARN), getAxiosConfig());
export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), getAxiosConfig());

export const sendApplication = (data: OmsorgspengesøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, getAxiosConfig());

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, getAxiosConfig());
