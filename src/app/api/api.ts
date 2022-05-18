import axios from 'axios';
import { axiosJsonConfig } from '../config/axiosConfig';
import { OmsorgspengesøknadApiData } from '../types/OmsorgspengesøknadApiData';
import { ResourceType } from '../types/ResourceType';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../utils/apiUtils';
import { BarnReceivedFromApi, Person } from '../types/Søkerdata';

export interface BarnResultType {
    barn: BarnReceivedFromApi[];
}

export const getSøker = () => axios.get<Person>(getApiUrlByResourceType(ResourceType.SØKER), axiosJsonConfig);
export const getBarn = () => axios.get<BarnResultType>(getApiUrlByResourceType(ResourceType.BARN), axiosJsonConfig);

export const sendApplication = (data: OmsorgspengesøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosJsonConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosJsonConfig);
