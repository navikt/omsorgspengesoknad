import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { SoknadFormData } from '../types/SoknadFormData';
import { AxiosResponse } from 'axios';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { ApiEndpoint } from '../types/ApiEndpoint';
import { axiosJsonConfig } from '../config/axiosConfig';
import hash from 'object-hash';
import { Person } from '../types/Person';
import { Barn } from '../types/Barn';
import { StepID } from './soknadStepsConfig';

export const STORAGE_VERSION = '4.0';

interface UserHashInfo {
    søker: Person;
    barn: Barn[];
}

interface SoknadTemporaryStorage extends Omit<PersistenceInterface<SoknadTempStorageData>, 'update'> {
    update: (
        soknadId: string,
        formData: Partial<SoknadFormData>,
        lastStepID: StepID,
        søkerInfo: UserHashInfo
    ) => Promise<AxiosResponse>;
}

const persistSetup = persistence<SoknadTempStorageData>({
    url: ApiEndpoint.MELLOMLAGRING,
    requestConfig: { ...axiosJsonConfig },
});

export const isStorageDataValid = (
    data: SoknadTempStorageData,
    userHashInfo: UserHashInfo
): SoknadTempStorageData | undefined => {
    if (
        data?.metadata?.version === STORAGE_VERSION &&
        data?.metadata.lastStepID !== undefined &&
        data.formData !== undefined &&
        data.metadata.soknadId !== undefined &&
        JSON.stringify(data.formData) !== JSON.stringify({}) &&
        hash(userHashInfo) === data.metadata.userHash
    ) {
        return data;
    }
    return undefined;
};

const SøknadTempStorage: SoknadTemporaryStorage = {
    update: (soknadId: string, formData: SoknadFormData, lastStepID: StepID, userHashInfo: UserHashInfo) => {
        return persistSetup.update({
            formData,
            metadata: { soknadId, lastStepID, version: STORAGE_VERSION, userHash: hash(userHashInfo) },
        });
    },
    create: persistSetup.create,
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default SøknadTempStorage;
