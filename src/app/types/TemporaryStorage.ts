import { StepID } from '../config/stepConfig';
import { OmsorgspengesøknadFormData } from './OmsorgspengesøknadFormData';

interface TemporaryStorageMetadata {
    version: string;
    lastStepID?: StepID;
}

export interface TemporaryStorage {
    metadata: TemporaryStorageMetadata;
    formData: Partial<OmsorgspengesøknadFormData>;
}
