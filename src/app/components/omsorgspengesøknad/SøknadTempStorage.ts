import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import { AxiosResponse } from 'axios';
import { getApiUrlByResourceType } from '../../utils/apiUtils';
import { TemporaryStorage } from '../../types/TemporaryStorage';
import { ResourceType } from '../../types/ResourceType';
import { StepID } from '../../config/stepConfig';
import { axiosJsonConfig } from '../../config/axiosConfig';

export const STORAGE_VERSION = '2.0';

interface SøknadPersistenceInterface extends Omit<PersistenceInterface<TemporaryStorage>, 'update'> {
    update: (formData: OmsorgspengesøknadFormData | undefined, lastStepID: StepID) => Promise<AxiosResponse>;
}

const persistSetup = persistence<TemporaryStorage>({
    url: getApiUrlByResourceType(ResourceType.MELLOMLAGRING),
    requestConfig: { ...axiosJsonConfig },
});

const SøknadTempStorage: SøknadPersistenceInterface = {
    create: () => {
        return persistSetup.create();
    },
    update: (formData: OmsorgspengesøknadFormData, lastStepID: StepID) => {
        return persistSetup.update({ formData, metadata: { lastStepID, version: STORAGE_VERSION } });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default SøknadTempStorage;
