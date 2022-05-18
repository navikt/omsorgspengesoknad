import { StepID } from '../config/stepConfig';
import { OmsorgspengesøknadFormData } from './OmsorgspengesøknadFormData';

export const MELLOMLAGRING_VERSION = '1';

export interface SoknadTempStorageData {
    metadata: {
        soknadId: string;
        lastStepID: StepID;
        version: string;
        userHash: string;
    };
    formData: OmsorgspengesøknadFormData;
}
