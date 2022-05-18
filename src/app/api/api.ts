import axios, { AxiosError } from 'axios';
import { axiosJsonConfig } from '../config/axiosConfig';
import { OmsorgspengesøknadApiData } from '../types/OmsorgspengesøknadApiData';
import { ResourceType } from '../types/ResourceType';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../utils/apiUtils';
import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';

type SoknadTempStorageRemoteData = RemoteData<AxiosError<any>, SoknadTempStorageData>;

export const getBarn = () => axios.get(getApiUrlByResourceType(ResourceType.BARN), axiosJsonConfig);
export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosJsonConfig);

export const sendApplication = (data: OmsorgspengesøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosJsonConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosJsonConfig);

export const getSoknadTempStorage = async (): Promise<SoknadTempStorageRemoteData> => {
    try {
        const { data } = await axios.get<SoknadTempStorageData>(ResourceType.MELLOMLAGRING, axiosJsonConfig);
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};
